import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { generateToken, hashPassword, comparePassword, authenticateToken } from "./auth";
import { minioClient, BUCKET_NAME, ensureBucketExists } from "./minio";
import { logActivity } from "./redis";
import { loginSchema, insertUserSchema, type UserPublic } from "@shared/schema";
import { randomUUID } from "crypto";

const upload = multer({ storage: multer.memoryStorage() });

function toPublicUser(user: any): UserPublic {
  const { password, ...publicUser } = user;
  return publicUser;
}

export async function registerRoutes(app: Express): Promise<Server> {
  await ensureBucketExists();

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "E-mail já cadastrado" });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      await logActivity(user.id, "user_registered", { email: user.email });

      res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error: any) {
      console.error("Register error:", error);
      res.status(400).json({ message: error.message || "Erro ao criar usuário" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const isPasswordValid = await comparePassword(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const publicUser = toPublicUser(user);
      const token = generateToken(publicUser);

      await logActivity(user.id, "user_login", { email: user.email });

      res.json({ user: publicUser, token });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Erro ao fazer login" });
    }
  });

  app.get("/api/users", authenticateToken, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      const publicUsers = users.map(toPublicUser);
      res.json(publicUsers);
    } catch (error: any) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.get("/api/users/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(toPublicUser(user));
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  });

  app.post("/api/users", authenticateToken, upload.single("avatar"), async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, birthDay, email, password } = req.body;
      
      if (!firstName || !lastName || !birthDay || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "E-mail já cadastrado" });
      }

      let avatarUrl: string | undefined;
      if (req.file) {
        try {
          const fileName = `avatars/${randomUUID()}-${req.file.originalname}`;
          await minioClient.putObject(BUCKET_NAME, fileName, req.file.buffer, req.file.size, {
            "Content-Type": req.file.mimetype,
          });
          avatarUrl = fileName;
        } catch (minioError) {
          console.error("MinIO upload error (continuing without avatar):", minioError);
        }
      }

      const hashedPassword = await hashPassword(password);
      const insertData: any = {
        firstName,
        lastName,
        birthDay,
        email,
        password: hashedPassword,
      };

      if (avatarUrl) {
        insertData.avatarUrl = avatarUrl;
      }

      const user = await storage.createUser(insertData);

      await logActivity((req as any).user.id, "user_created", { newUserId: user.id, email: user.email });

      res.status(201).json(toPublicUser(user));
    } catch (error: any) {
      console.error("Create user error:", error);
      res.status(400).json({ message: error.message || "Erro ao criar usuário" });
    }
  });

  app.put("/api/users/:id", authenticateToken, upload.single("avatar"), async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, birthDay, email, password } = req.body;
      
      const existingUser = await storage.getUser(req.params.id);
      if (!existingUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      if (email && email !== existingUser.email) {
        const emailExists = await storage.getUserByEmail(email);
        if (emailExists) {
          return res.status(400).json({ message: "E-mail já cadastrado" });
        }
      }

      const updateData: any = {};
      
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (birthDay) updateData.birthDay = birthDay;
      if (email) updateData.email = email;

      if (password && password.trim().length > 0) {
        updateData.password = await hashPassword(password);
      }

      if (req.file) {
        try {
          const fileName = `avatars/${randomUUID()}-${req.file.originalname}`;
          await minioClient.putObject(BUCKET_NAME, fileName, req.file.buffer, req.file.size, {
            "Content-Type": req.file.mimetype,
          });
          updateData.avatarUrl = fileName;
        } catch (minioError) {
          console.error("MinIO upload error (continuing without avatar update):", minioError);
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.json(toPublicUser(existingUser));
      }

      const updatedUser = await storage.updateUser(req.params.id, updateData);

      await logActivity((req as any).user.id, "user_updated", { updatedUserId: req.params.id });

      res.json(toPublicUser(updatedUser!));
    } catch (error: any) {
      console.error("Update user error:", error);
      res.status(400).json({ message: error.message || "Erro ao atualizar usuário" });
    }
  });

  app.delete("/api/users/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      await logActivity((req as any).user.id, "user_deleted", { deletedUserId: req.params.id });

      res.json({ message: "Usuário excluído com sucesso" });
    } catch (error: any) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Erro ao excluir usuário" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

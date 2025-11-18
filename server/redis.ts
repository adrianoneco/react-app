import Redis from "ioredis";

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error("Redis environment variables are not set");
}

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

export async function logActivity(userId: string, action: string, details?: any) {
  try {
    const logEntry = {
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    
    await redisClient.lpush("activity_logs", JSON.stringify(logEntry));
    await redisClient.ltrim("activity_logs", 0, 999);
  } catch (error) {
    console.error("Error logging activity to Redis:", error);
  }
}

export async function getRecentLogs(limit: number = 50): Promise<any[]> {
  try {
    const logs = await redisClient.lrange("activity_logs", 0, limit - 1);
    return logs.map(log => JSON.parse(log));
  } catch (error) {
    console.error("Error getting logs from Redis:", error);
    return [];
  }
}

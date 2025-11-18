# Design Guidelines - Sistema de Autenticação em Português

## Design Approach
**Hybrid Approach**: Modern authentication system combining Material Design's form patterns with custom gradient aesthetics as specified by the user.

## Core Design Principles
1. **Bilingual Excellence**: All UI elements, labels, messages, and validations in Portuguese (pt-BR)
2. **Gradient Identity**: Dark blue to dark purple vertical gradient as the signature visual element
3. **Theme Duality**: Seamless light/dark mode with smooth transitions throughout

---

## Typography
- **Primary Font**: Inter (Google Fonts) for clarity and modern feel
- **Headings**: font-semibold to font-bold, sizes from text-2xl to text-4xl
- **Body Text**: font-normal, text-sm to text-base
- **Form Labels**: text-sm font-medium
- **Hierarchy**: Clear distinction between primary actions, secondary text, and helper text

---

## Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Container padding: p-4 to p-8
- Section spacing: py-8 to py-16
- Component gaps: gap-4 to gap-6
- Form field spacing: space-y-4

---

## Component Library

### Header Component
- **Gradient**: `bg-gradient-to-b from-blue-900 via-blue-800 to-purple-900` (dark theme)
- **Height**: h-16 fixed with shadow-lg
- **Contents**: Logo/brand on left, theme toggle and user menu on right
- **Transition**: `transition-all duration-300` for theme switching

### Login Form
- **Container**: max-w-md centered with backdrop-blur-sm
- **Background**: Lighter gradient matching header - `bg-gradient-to-b from-blue-100 to-purple-100` (light theme), `from-blue-950/40 to-purple-950/40` (dark theme)
- **Border**: rounded-2xl with subtle shadow
- **Padding**: p-8
- **Fields**: Full-width inputs with focus rings matching gradient colors

### User CRUD Table
- **Layout**: Responsive table with alternating row colors
- **Columns**: Nome, Sobrenome, Data de Nascimento, Email, Ações
- **Actions**: Icon buttons for Edit/Delete in actions column
- **Mobile**: Stack cards instead of table on small screens

### Form Inputs (Universal)
- **Style**: rounded-lg with border-2
- **Focus State**: ring-2 ring-purple-500 (dark theme), ring-blue-600 (light theme)
- **Labels**: Above inputs, text-sm font-medium
- **Validation**: Red border + helper text below for errors
- **Date Picker**: Brazilian format (DD/MM/YYYY)

### Buttons
- **Primary**: Gradient background `bg-gradient-to-r from-blue-600 to-purple-600`, text-white, rounded-lg, px-6 py-3
- **Secondary**: Border-2 with gradient border, transparent background
- **States**: hover:shadow-lg transform hover:scale-105 transition-all
- **Disabled**: opacity-50 cursor-not-allowed

### Theme Toggle
- **Type**: Icon switch (sun/moon icons)
- **Position**: Top-right header
- **Animation**: rotate and fade transition between icons

---

## Theme Specifications

### Light Theme
- Background: bg-gray-50
- Cards/Forms: bg-white with shadow-md
- Text: text-gray-900 (primary), text-gray-600 (secondary)
- Borders: border-gray-200
- Header Gradient: from-blue-600 via-blue-700 to-purple-700

### Dark Theme
- Background: bg-gray-900
- Cards/Forms: bg-gray-800 with shadow-2xl
- Text: text-gray-100 (primary), text-gray-400 (secondary)
- Borders: border-gray-700
- Header Gradient: from-blue-900 via-blue-800 to-purple-900

**Transition**: All theme changes use `transition-colors duration-300`

---

## Page Layouts

### Login Page
- Centered card on full-height screen
- Background: Subtle gradient mesh pattern
- Form includes: Email, Password fields + "Entrar" button + "Esqueci minha senha" link
- Logo above form

### Dashboard/CRUD Page
- Header at top (fixed)
- Sidebar navigation (collapsible on mobile)
- Main content area: User table with "Adicionar Usuário" button
- Modal overlay for Create/Edit forms

### User Form (Create/Edit)
- Modal centered on screen with backdrop
- Fields: Nome, Sobrenome, Data de Nascimento, Email, Senha
- Action buttons: "Salvar" (primary) + "Cancelar" (secondary)

---

## Portuguese Labels & Messages
- Login: "Entrar"
- Email: "E-mail"
- Password: "Senha"
- First Name: "Nome"
- Last Name: "Sobrenome"
- Birth Date: "Data de Nascimento"
- Save: "Salvar"
- Cancel: "Cancelar"
- Delete: "Excluir"
- Edit: "Editar"
- Add User: "Adicionar Usuário"
- Validation messages in Portuguese (e.g., "Campo obrigatório", "E-mail inválido")

---

## Accessibility
- ARIA labels in Portuguese
- Keyboard navigation for all interactive elements
- Focus indicators with gradient-colored rings
- Minimum touch target size: 44x44px
- Color contrast ratios meeting WCAG AA standards in both themes

---

## Animations
**Minimal and purposeful only:**
- Theme toggle: 300ms color transition
- Button hover: subtle scale transform
- Form field focus: smooth ring appearance
- Modal appearance: fade + scale from 95% to 100%
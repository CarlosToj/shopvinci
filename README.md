# 🛒 ShopVinci — Plataforma de Tienda en Línea

Proyecto del semestre — Ingeniería de Software 1 | Universidad Da Vinci de Guatemala | 2026

## Descripción

ShopVinci es una plataforma de comercio electrónico que permite a compradores navegar productos, realizar compras y hacer seguimiento de pedidos, mientras los comerciantes gestionan su inventario y ventas desde un panel dedicado.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React.js 18 + Tailwind CSS |
| Backend | Node.js + Express.js |
| Base de datos | MySQL 8 |
| Autenticación | JWT (JSON Web Tokens) |
| ORM | Sequelize |
| Testing | Jest |
| Control de versiones | Git + GitHub |

## Requisitos previos

- Node.js v18 o superior
- MySQL 8
- Git
- Visual Studio Code (recomendado)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/shopvinci.git
cd shopvinci
```

### 2. Configurar la base de datos

Abre MySQL y ejecuta:

```sql
CREATE DATABASE shopvinci_db;
```

Luego importa el esquema:

```bash
mysql -u root -p shopvinci_db < backend/src/config/shopvinci_db.sql
```

### 3. Configurar variables de entorno del backend

```bash
cd backend
cp .env.example .env
```

Edita el archivo `.env` con tus datos de MySQL.

### 4. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 5. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 6. Iniciar el proyecto

Terminal 1 — Backend:
```bash
cd backend
npm run dev
```

Terminal 2 — Frontend:
```bash
cd frontend
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 7. Ejecutar pruebas

```bash
cd backend
npm test
```

## Integrantes

| Nombre | Carné | Rol Scrum |
|--------|-------|-----------|
| _________________________ | _________ | Product Owner |
| _________________________ | _________ | Scrum Master |
| _________________________ | _________ | Equipo de Desarrollo |

## Catedrático

Ing. Raúl Hernández Reyna — Ingeniería de Software 1 — 1er Semestre 2026

# Task Manager - Full Stack Monorepo 🚀

Este repositorio contiene la solución completa para la prueba técnica de **Full Stack Developer**. Es una aplicación robusta de gestión de tareas (Task Manager) con autenticación segura, donde cada usuario tiene un espacio de datos aislado, permitiéndole ver, crear, actualizar y eliminar únicamente sus propias tareas.

El proyecto está estructurado como un **Monorepo** que aloja tanto el servicio del Backend como la aplicación del Frontend.

---

## 📁 Estructura del Repositorio


```

FILE_GENERATED

├── backend/     # Servicio API REST desarrollado con NestJS, Prisma y PostgreSQL
└── frontend/    # Aplicación web SPA desarrollada con React 19, Vite 8 y Tailwind CSS

```

---

## 🛠️ Stack Tecnológico

### Backend

* **Framework Principal:** NestJS (v10+) con TypeScript nativo.
* **Base de Datos:** PostgreSQL remoto hospedado en **Supabase**.
* **ORM:** Prisma v7 con un enfoque de configuración programática mediante un Driver Adapter (`@prisma/adapter-pg`) para gestionar eficientemente pools de conexión remota de manera segura.
* **Seguridad:** Encriptación de contraseñas mediante `bcrypt` (10 rondas de salado).
* **Autenticación:** Passport.js + JWT (JSON Web Tokens) con estrategia de extracción Bearer en cabeceras HTTP.
* **Validación:** Validación automática global de tipos e inputs usando `class-validator` y `class-transformer` mediante DTOs estrictos libres de `any`.

### Frontend

* **Entorno de Desarrollo:** Vite 8 + TypeScript 6.
* **Biblioteca UI:** React 19 (Arquitectura basada en características/features).
* **Manejo de Estado Asíncrono:** `@tanstack/react-query` (React Query v5) para la sincronización perfecta con la API, cacheo óptimo y revalidación de datos.
* **Estilos:** Tailwind CSS v4 para interfaces rápidas, limpias y adaptativas (Mobile-First).
* **Enrutado:** React Router DOM v7.
* **Cliente HTTP:** Axios estructurado mediante instancias personalizadas e interceptores globales para inyección de JWT.

### Suite de Pruebas (Testing)

* **Frontend:** Vitest + React Testing Library + JSDOM. Pruebas unitarias de componentes clave (`CreateTaskModal`, `TaskCard`, `TaskFiltersBar`) y testing de integración asíncrono para la capa de servicios de comunicación con la API.

**Backend:** Jest + Supertest + NestJS Testing Utilities.
* **Pruebas Unitarias:** Validación de la lógica de negocio en `TasksService`, utilizando mocks de los repositorios de Prisma mediante `jest.mock` y `spyOn` para asegurar el aislamiento de las dependencias.
* **Pruebas de Integración (E2E):** Ejecución de una instancia completa de la aplicación en memoria, simulando el ciclo de vida real de las peticiones HTTP mediante Supertest. Incluye la validación de `Pipes` de transformación y validación de DTOs, protección de rutas con `Guards` (JWT) y pruebas de persistencia con transacciones reversibles para asegurar la integridad de la API bajo escenarios de fallo (400, 401).

---

## ⚙️ Configuración y Variables de Entorno

Antes de correr el proyecto localmente, debes crear los archivos de configuración de variables de entorno en sus respectivas carpetas.

### 1. Variables del Backend (`backend/.env`)

Crea un archivo `.env` dentro del directorio `backend/` basándote en el archivo de ejemplo:

```env
PORT=3000
DATABASE_URL="postgresql://postgres.[id-supabase]:[password]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="una_clave_secreta_super_segura_para_el_token_jwt_2026"
JWT_EXPIRES_IN="24h"

```

### 2. Variables del Frontend (`frontend/.env`)

Crea un archivo `.env` dentro del directorio `frontend/` para apuntar al servidor local:

```env
VITE_API_BASE_URL="http://localhost:3000/api"

```

---

## 🚀 Instalación y Despliegue Local

Sigue estos pasos para levantar todo el ecosistema en tu máquina local:

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/CristhianWaldrop/compinche-task-manager.git
cd compinche-task-manager

```

### Paso 2: Inicializar y Correr el Backend

1. Navega a la carpeta del backend e instala sus dependencias:
```bash
cd backend
npm install

```


2. Ejecuta las migraciones de Prisma para asegurarte de sincronizar el esquema de la base de datos de Supabase:
```bash
npx prisma db push

```


3. Levanta el servidor de desarrollo:
```bash
npm run start:dev

```


*El backend estará escuchando activamente en `http://localhost:3000` con el prefijo global `/api`.*

### Paso 3: Inicializar y Correr el Frontend

1. Abre una nueva terminal, navega a la carpeta del frontend e instala dependencias:
```bash
cd frontend
npm install

```


2. Inicia el servidor de desarrollo web:
```bash
npm run dev

```


*El frontend se abrirá automáticamente en `http://localhost:5173`.*

---

## 🧪 Ejecución de la Suite de Pruebas en Frontend (Tests)

Hemos implementado una sólida base de pruebas unitarias y de integración que garantizan la estabilidad del software.

Para ejecutar los tests en el frontend, ve a la carpeta correspondiente y ejecuta:

```bash
cd frontend
npm run test

```

Esto lanzará **Vitest**, ejecutando las pruebas de:

* Validación local de formularios y control de modales (`CreateTaskModal.test.tsx`).
* Formateo de fechas adaptativas y renderizado condicional de estados (`TaskCard.test.tsx`).
* Comportamiento interactivo y clases visuales activas (`TaskFiltersBar.test.tsx`).
* Aislamiento de peticiones HTTP mediante mocks estrictos de Axios (`tasks.service.test.ts`).

---

## 🧪 Ejecución de la Suite de Pruebas en Backend (Tests)

Hemos implementado una sólida base de pruebas unitarias y de integración que garantizan la estabilidad del software en el servidor.

Para ejecutar los tests en el backend, ve a la carpeta correspondiente y ejecuta:

```bash
cd backend
npm run test        # Pruebas unitarias
npm run test:e2e    # Pruebas de integración

```

Esto lanzará **Jest** y **Supertest**, cubriendo los siguientes pilares:

* **Pruebas Unitarias:** Validación de la lógica de negocio en `AuthService` y `TasksService`, utilizando mocks de los repositorios de Prisma (`jest.mock` y `spyOn`) para asegurar el aislamiento total de las dependencias.
* **Pruebas de Integración (E2E):** Ejecución de una instancia completa de la aplicación en memoria. Validamos el ciclo de vida real de las peticiones HTTP, asegurando el correcto funcionamiento de:
* **Pipes:** Transformación y validación estricta de DTOs (`ValidationPipe`).
* **Guards:** Protección de rutas mediante estrategias JWT (`JwtAuthGuard`).
* **Controladores:** Verificación de códigos de estado (200, 201, 400, 401, 404, 409) bajo escenarios de éxito y fallo, garantizando la integridad de la API.

---
## 🧠 Decisiones Técnicas y Arquitectura

1. **Uso de NestJS y Estructura Modular:** En el backend se optó por NestJS debido a su arquitectura fuertemente tipada que previene errores en tiempo de ejecución. Los módulos de `Auth` y `Tasks` encapsulan perfectamente sus controladores, servicios y DTOs, asegurando el principio de responsabilidad única.
2. **Estrategia del Driver Adapter en Prisma v7:** Para solventar los problemas habituales de agotamiento de sockets en entornos en la nube (como Supabase) trabajando con ORMs tradicionales, se implementó de forma programática el adaptador `@prisma/adapter-pg`. Esto optimiza el pool de conexiones mediante PgBouncer.
3. **Manejo de Estado con React Query:** En lugar de saturar el contexto de React o recurrir a Redux para guardar los arreglos de tareas, se delegó todo el estado asíncrono a `@tanstack/react-query`. Esto nos provee automáticamente de mecanismos de *cache-fresh*, invalidación de queries en mutaciones (añadir/editar/borrar una tarea invalida inmediatamente la lista, gatillando un refetch silencioso) y control unificado de estados de carga (`isPending`) y error (`apiError`).
4. **Diseño de Interfaz Accesible:** Los componentes del formulario fueron optimizados añadiendo atributos semánticos explícitos (`htmlFor` e `id`) para permitir una navegación fluida mediante tecnologías de asistencia y asegurar la estabilidad de las pruebas con React Testing Library basándose en accesibilidad de roles.

---

## ⏳ Próximos Pasos & Deuda Técnica (Qué dejaría pendiente)

Si contara con más tiempo para llevar este proyecto a un estándar de producción a gran escala, priorizaría los siguientes puntos:

1. **Pruebas End-to-End (E2E):** Implementar flujos completos simulados de usuario (Registro ➡️ Login ➡️ Crear Tarea ➡️ Marcar como Completada ➡️ Logout) utilizando **Playwright** o **Cypress**.
2. **Paginación Infinita en el Cliente:** Cambiar la paginación tradicional numérica del frontend por un scroll infinito o botón de "Cargar más" utilizando `useInfiniteQuery` de React Query, mejorando sensiblemente la UX móvil.
3. **Soft Deletes en Base de Datos:** Cambiar la eliminación física de las tareas (`onDelete: Cascade`) por una columna `deletedAt` (Soft Delete) para permitir la recuperación de tareas borradas accidentalmente por el usuario.
4. **Documentación de API Abierta:** Integrar `@nestjs/swagger` en el backend para auto-generar un portal interactivo OpenAPI en `/api/docs` que facilite el testing de endpoints.
5. **Dockerización Completa:** Añadir un archivo `docker-compose.yml` en la raíz para orquestar contenedores locales del backend, frontend y una instancia local de PostgreSQL, permitiendo levantar todo el entorno con un solo comando (`docker-compose up`).
"""
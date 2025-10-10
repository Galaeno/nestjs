# NestJS

El curso será de: https://fazt.dev/contenido/nestjs
Documentacion NestJS: https://docs.nestjs.com/

# Descripción

Curso de NestJS: Desarrollo de Aplicaciones Backend Modernas en TypeScript
Hey Coders, en este curso aprenderán las bases de NestJS, uno de los frameworks más populares de Node.js y TypeScript, ampliamente utilizado en proyectos de backend a gran escala.

## Introducción

¡Bienvenido al curso de NestJS! En este curso, exploraremos una de las plataformas más emocionantes y poderosas para el desarrollo de aplicaciones backend en el ecosistema de JavaScript/TypeScript.

## ¿Qué es NestJS?

NestJS es un framework de Node.js que utiliza TypeScript para construir aplicaciones backend escalables y eficientes. Basado en los principios de Angular, NestJS ofrece una estructura modular y una arquitectura centrada en módulos, lo que facilita la creación y mantenimiento de aplicaciones complejas.

## ¿Por qué NestJS?

- Productividad: NestJS proporciona una sintaxis clara y concisa, reduciendo el código repetitivo y mejorando la productividad del desarrollador.
- Escalabilidad: Gracias a su enfoque modular y la inyección de dependencias, NestJS permite escalar aplicaciones de manera eficiente a medida que crecen en complejidad y tamaño.
- Compatibilidad con TypeScript: Al estar construido con TypeScript, NestJS ofrece tipado estático y otras características avanzadas que facilitan el desarrollo de aplicaciones robustas y con menos errores.

## ¿Qué aprenderás en este curso?

En este curso, cubriremos los siguientes temas:

- Instalación y configuración de NestJS.
- Fundamentos de NestJS: Controladores, Módulos, Servicios y más.
- Integración con bases de datos: MongoDB, PostgreSQL, y otras a través de Prisma.
- Implementación de autenticación y autorización.
- Creación de APIs RESTful.
- Despliegue de aplicaciones NestJS en Railway junto a una base de datos.

# Instalación y configuración de NestJS

- Instalancion de NestJS / checkear version / ver comandos

```bash
npm i -g @nestjs/cli
nest -v
nest
```

## Creamos nuevo proyecto

```bash
nest new <nombre_proyecto>
```

## Ejecutamos el proyecto

```bash
cd my_app
pnpm run start
pnpm run start:dev
pnpm run build
pnpm run lint
```

## Cambio iconos para que se usen los de NestJs y no AngularJS

- F1 > Open Workspace Settings (JSON)
- Agregar el json: "material-icon-theme.activeIconPack": "nest"

# Estructura proyecto

Este documento presenta **4 estructuras progresivas** para proyectos NestJS. Cada nivel incluye estructura de carpetas, **por qué/para qué**, **cuándo usarla**, **riesgos** y **cómo migrar** al siguiente nivel.

---

## 🟢 Nivel 1 — Básica (la típica de Nest)

**Ideal para:** MVPs y servicios pequeños.

**Estructura:**

```text
src/
  main.ts
  app.module.ts
  modules/
    users/
      users.module.ts
      users.controller.ts
      users.service.ts
      dto/
      entities/
      repos/
```

**Por qué:**  
Familiar y rápida. Separación mínima: transporte (controller) vs lógica (service).

**Cuándo usarla:**  
1–2 módulos, lógica sencilla, equipo chico.

**Riesgos:**  
El `service` puede crecer demasiado; acoplamiento al ORM si no hay `repos/`.

**Migración:**  
Separar DTOs y repos; preparar `common/` y `config/` (ver Nivel 2).

---

## 🟡 Nivel 2 — Intermedia modular (mejor higiene)

**Ideal para:** APIs medianas con cross‑cutting claro.

**Estructura:**

```text
src/
  main.ts
  app.module.ts
  common/                  # filters, pipes, guards, interceptors, utils
    filters/
    pipes/
    guards/
    interceptors/
  config/                  # validación/carga de env
  modules/
    users/
      users.module.ts
      users.controller.ts
      users.service.ts
      dto/
      entities/
      repos/
    auth/
      auth.module.ts
      auth.controller.ts
      auth.service.ts
      strategies/
      guards/
```

**Por qué:**  
Centraliza y estandariza lo transversal (errores, logs, auth, validación).

**Cuándo usarla:**  
3–8 módulos, varios devs trabajando en paralelo.

**Riesgos:**  
`service` aún mezcla orquestación con reglas si el dominio crece.

**Migración:**  
Extraer reglas de negocio a **domain services** y definir **repos como interfaces** (puertos) para facilitar el Nivel 3.

---

## 🟠 Nivel 3 — Capas limpias (Hexagonal sin CQRS)

**Ideal para:** Dominios medianos/grandes. Aísla negocio de framework/infra.

**Estructura:**

```text
src/
  main.ts
  app.module.ts
  common/
  config/
  modules/
    payments/
      payments.module.ts
      application/               # orquestación / casos de uso
        payments.service.ts      # create(), capture(), cancel(), getById()...
      domain/                    # reglas puras (sin Nest/ORM)
        entities/
          payment.entity.ts
        value-objects/
        services/
          payment.domain-service.ts
        ports/
          payment.repository.port.ts    # interfaz del repo
      infrastructure/            # detalles técnicos
        http/
          payments.controller.ts
          dto/
        persistence/
          payment.prisma-repo.ts        # implementa el puerto
        mappers/
```

**Por qué:**  
Separación **dominio / aplicación / infraestructura** (puertos & adaptadores). Test más rápidos, facilidad para cambiar ORM/broker sin tocar negocio.

**Cuándo usarla:**  
Reglas no triviales, cambios de infraestructura frecuentes, varios equipos/PRs simultáneos.

**Riesgos:**  
Más carpetas/boilerplate; necesita disciplina para no cruzar capas.

**Migración:**

- Extraer lógica del service hacia `domain/services`.
- Definir `ports/` (interfaces) y adaptadores en `infrastructure/`.
- Mantener controllers delgados (DTO ↔ service).

---

## 🔴 Nivel 4 — Avanzada (CQRS + Eventos + Proyecciones)

**Ideal para:** Dominios complejos, auditoría, lectura pesada, integraciones event‑driven.

**Estructura:**

```text
src/
  main.ts
  app.module.ts
  modules/
    payments/
      payments.module.ts
      application/
        commands/
          create-payment/
            create-payment.command.ts
            create-payment.service.ts     # handler/orquestación
        queries/
          get-payment/
            get-payment.query.ts
            get-payment.service.ts        # handler de lectura
        events/
          payment-created.event.ts
      domain/
        entities/
        value-objects/
        services/
        ports/
          payment.repo.port.ts
          event.publisher.port.ts
      infrastructure/
        http/
          payments.controller.ts
          dto/
        persistence/
          payment.prisma-repo.ts
        messaging/
          kafka.publisher.ts
          kafka.subscriber.ts
        projections/
          payment.read-model.repo.ts
```

**Por qué:**  
Diferencia explícita entre **escritura** (commands) y **lectura** (queries), soporte para **eventos** y **proyecciones**. Facilita escalabilidad de lecturas, cache y auditoría.

**Cuándo usarla:**  
Pagos, órdenes, logística, integraciones por eventos, necesidades de consistencia eventual y reporting.

**Riesgos:**  
Complejidad conceptual/operativa mayor. No aplicar si la app es CRUD simple.

**Migración:**

- Dividir casos de uso entre **commands** (mutan estado) y **queries** (solo lectura).
- Introducir `event.publisher.port` y adaptadores (Kafka/SNS/SQS).
- Agregar proyecciones sólo si hay dolor real en lecturas.

---

## 🧭 ¿Cuándo subir de nivel?

- **1 → 2:** múltiples módulos y cross‑cutting disperso (errores, logs, auth).
- **2 → 3:** services gordos, tests lentos, cambios de infra duelen.
- **3 → 4:** lecturas exigentes, auditoría fina, integraciones event‑driven.

---

## 💡 Tips transversales

- **DTO ≠ Entidad**: validá DTOs con `class-validator` (pipe global) y mapeá a dominio.
- **Repos como interfaz** desde Nivel 2: prepara el terreno para Hexagonal.
- **Config tipada/validada**: `@nestjs/config` + zod o `class-validator`.
- **Observabilidad**: logs JSON (Pino), tracing (OpenTelemetry), métricas por request.
- **Errores**: `ExceptionFilter` global (mapea dominio → HTTP 400/409/422/5xx).
- **Auth**: `Guards` + decorators; mantené services libres de transporte.

---

## 📝 Resumen rápido

- **Nivel 1 →** velocidad y simplicidad.
- **Nivel 2 →** organización transversal.
- **Nivel 3 →** mantenibilidad y desacoplamiento de infra.
- **Nivel 4 →** escalabilidad (reads/writes) y event‑driven.

## Resumen

### Mapa mental (rápido)

- **DTO (request/response)** → _capa de aplicación/HTTP_. Son **clases** con `class-validator` / Swagger.
  - Viven en: `src/modules/<feature>/dto/`
  - Usados en controllers/resolvers.
  - JSON-friendly (si hay `bigint`, exponer como `string`).

- **Entity (modelo de dominio)** → _núcleo del negocio_. Reglas/invariantes y posible comportamiento (`toggle()`, etc.).
  - Viven en: `src/modules/<feature>/domain/`
  - Puro TypeScript (sin Nest/Prisma/HTTP).

- **Ports (interfaces)** → contratos que el dominio necesita (p.ej. `TasksRepository`).
  - Viven en: `src/modules/<feature>/domain/ports/`
  - Puro TypeScript. No dependen de libs externas.

- **Infra (adapters)** → implementaciones concretas de los **ports** con tecnología real (Prisma/Redis/HTTP).
  - Viven en: `src/modules/<feature>/infra/`
  - Dependen de Prisma/Nest/etc.
  - Mapean **ORM ↔ Entity**.

- **Service de aplicación (Nest)** → orquesta casos de uso: llama **ports**, maneja transacciones, mapea **DTO ↔ Entity**, publica eventos.
  - Archivo típico: `src/modules/<feature>/<feature>.service.ts`
  - **No** debería codificar políticas complejas (delegarlas al dominio).

- **Service de dominio (opcional)** → reglas/políticas puras que no pertenecen a una sola Entity o involucran varias.
  - Viven en: `src/modules/<feature>/domain/services/`
  - Puro TS, sin infra.

---

### Flujo end-to-end (ASCII)

```
Request JSON
   ↓ (DTO req: valida/transforma)
Controller ── mapea DTO → Entity/Command ──► Service (aplicación)
                                              │
                                              ▼ (port / interface)
                              TasksRepository (domain/ports) … contrato
                                              │
                                              ▼ (implementación real)
                       PrismaTasksRepository (infra) ──► DB (Prisma)
                                              ▲
                               mapea ORM ↔ Entity (dominio puro)
                                              │
Service ◄────────────── Entity/resultado ─────┘
   │
Controller ── mapea Entity → DTO resp ──► Response JSON
```

---

### Estructura de carpetas recomendada

```
src/
├─ common/                       # cross-cutting técnico (guards, pipes, middleware, etc.)
│  ├─ guards/
│  ├─ pipes/
│  └─ middleware/
├─ infra/                        # infraestructura compartida
│  └─ prisma/
│     ├─ prisma.service.ts
│     └─ prisma.module.ts
├─ modules/
│  └─ tasks/
│     ├─ domain/
│     │  ├─ task.entity.ts
│     │  ├─ services/           # opcional: reglas puras
│     │  └─ ports/
│     │     └─ tasks.repository.ts
│     ├─ infra/
│     │  └─ prisma-tasks.repository.ts
│     ├─ dto/
│     │  ├─ create-task.dto.ts
│     │  ├─ update-task.dto.ts
│     │  └─ task.response.ts
│     ├─ tokens.ts              # Symbols p/ DI de ports
│     ├─ tasks.controller.ts
│     ├─ tasks.service.ts       # orquestación (aplicación)
│     └─ tasks.module.ts
├─ app.module.ts
└─ main.ts
```

> **`common/`** es técnico, no pongas reglas de negocio ahí.  
> **Dominio** debe compilar y testear sin instalar Prisma/Nest.

---

### Cuándo va **Service en dominio** vs **Service en aplicación**

- **Dominio**: políticas puras/algoritmos/reglas cross-entity sin infra.
  - - testeable sin DB/HTTP, + reusabilidad.
- **Aplicación**: orquestación; llama repos, mapea DTO↔Entity, maneja transacciones/eventos.

**Regla de oro:** si necesita librerías externas o coordina dependencias → **aplicación**. Si es solo lógica de negocio pura → **dominio**.

---

### Ejemplos breves

#### 1) Entity (dominio)

```ts
// domain/task.entity.ts
export class Task {
  constructor(
    public readonly id: bigint,
    public title: string,
    public status: boolean,
  ) {
    if (!title?.trim()) throw new Error('Título requerido');
  }
  toggle() {
    this.status = !this.status;
  }
}
```

#### 2) Port (contrato)

```ts
// domain/ports/tasks.repository.ts
import { Task } from '../task.entity';
export interface TasksRepository {
  findById(id: bigint): Promise<Task | null>;
  save(task: Task): Promise<void>;
  delete(id: bigint): Promise<void>;
}
```

#### 3) Infra (implementación del port con Prisma)

```ts
// infra/prisma-tasks.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { TasksRepository } from '../domain/ports/tasks.repository';
import { Task } from '../domain/task.entity';

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(r: { id: bigint; title: string; status: boolean }): Task {
    return new Task(r.id, r.title, r.status);
  }

  async findById(id: bigint) {
    const row = await this.prisma.task.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async save(task: Task) {
    await this.prisma.task.upsert({
      where: { id: task.id },
      create: { id: task.id, title: task.title, status: task.status },
      update: { title: task.title, status: task.status },
    });
  }

  async delete(id: bigint) {
    await this.prisma.task.delete({ where: { id } });
  }
}
```

#### 4) Service de aplicación (Nest)

```ts
// tasks.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TASKS_REPOSITORY } from './tokens';
import { TasksRepository } from './domain/ports/tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_REPOSITORY) private readonly repo: TasksRepository,
  ) {}

  async getTask(id: bigint) {
    const t = await this.repo.findById(id);
    if (!t) throw new NotFoundException('Task no encontrada');
    return t;
  }
}
```

#### 5) Controller + DTO (HTTP)

```ts
// dto/task.response.ts
export class TaskResponse {
  id!: string;
  title!: string;
  status!: boolean;
}

// tasks.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskResponse } from './dto/task.response';
import { ParseBigIntPipe } from '../../common/pipes/parse-bigint.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get(':id')
  async findOne(
    @Param('id', ParseBigIntPipe) id: bigint,
  ): Promise<TaskResponse> {
    const t = await this.service.getTask(id);
    return { id: t.id.toString(), title: t.title, status: t.status };
  }
}
```

---

### Checklist rápido

- [ ] **DTOs**: clases (no interfaces), validación y Swagger; response JSON-friendly.
- [ ] **Entities**: reglas + comportamiento; sin Nest/Prisma.
- [ ] **Ports**: interfaces en `domain/ports`; 0 dependencias externas.
- [ ] **Infra**: adapters que implementan ports y mapean ORM↔Entity.
- [ ] **Services (aplicación)**: orquestación; dependen de ports (no de Prisma).
- [ ] **Opcional**: _domain services_ para políticas complejas.
- [ ] **Common**: solo cross-cutting técnico (no negocio).

---

### TL;DR (una línea)

**Dominio** = reglas puras + contratos (entities/ports); **Infra** = implementación real de esos contratos; **Aplicación** = orquesta y mapea DTO↔dominio.  
Con Prisma: mapeá **Prisma ↔ Entity** en _infra_, y **Entity ↔ DTO** en el _controller/service_.

---

# Fundamentos de NestJS

## Modules

Todo en Nest vive dentro de **módulos**. Un módulo agrupa **controladores**, **servicios** y **providers** relacionados.

```ts
import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService], // opcional, para que otros módulos lo usen
})
export class ProductosModule {}
```

- `imports`: otros módulos de los que dependemos.
- `controllers`: reciben requests.
- `providers`: servicios, repositorios, factories, etc. **Inyectables**.
- `exports`: qué providers exponemos a módulos consumidores.

**AppModule** (raíz) compone el resto:

```ts
@Module({
  imports: [ProductosModule],
})
export class AppModule {}
```

- Se va a usar nest generate

```bash
nest g <opcion> <nombre>
```

- Para ver los comandos posibles

```bash
nest g --help
```

- Creacion de modulo con nombre "tasks"

```bash
nest g module tasks
```

## Controllers

Definen **rutas** y manejan **requests/responses**. Son **delgados**; delegan lógica al **servicio**.
[DOC](https://docs.nestjs.com/controllers)

```ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productos: ProductosService) {} // esto es la forma resumida de crear la variable y luego hacer el this.productos = productos

  @Get()
  findAll() {
    return this.productos.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productos.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.productos.create(dto);
  }
}
```

Rutas comunes: `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`.  
Parámetros: `@Param`, `@Query`, `@Body`, `@Headers`, `@Req`, `@Res`, etc.

- Dentro de Controller esta la ruta del controller, en el ejemplo tasks, para acceder sera: http://localhost:4000/tasks
- El metodo getAllTasks tiene el decorador Get con la ruta /, para acceder sera: http://localhost:4000/tasks (misma ruta porque tiene /)
- En caso que haya mas niveles, ejemplo en el Get esta /task, para acceder sera: http://localhost:4000/tasks/task

- Creacion de controlador con nombre "tasks"

```bash
nest g co tasks
```

## Services

Encapsulan **lógica de negocio** y acceso a datos. Son **providers** que se **inyectan**.

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductosService {
  private items = new Map<string, any>();

  findAll() {
    return [...this.items.values()];
  }

  findOne(id: string) {
    const it = this.items.get(id);
    if (!it) throw new NotFoundException('Producto no encontrado');
    return it;
  }

  create(dto: CreateProductoDto) {
    const id = crypto.randomUUID();
    const nuevo = { id, ...dto };
    this.items.set(id, nuevo);
    return nuevo;
  }
}
```

**DI (Inyección de dependencias)**: Nest resuelve instancias según **scope** y **módulo**.

- Creacion de controlador con nombre "tasks"

```bash
nest g s tasks
```

- Se agregan en los controllers, o bien, donde sean necesarios de la siguiente forma:

```ts
import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.taskService.getTasks();
  }
}
```

## DTOs y Validación

Para validar entrada y documentar contratos, usamos **DTOs** con `class-validator` + `class-transformer` y el **ValidationPipe**.

```bash
pnpm add class-validator class-transformer
```

```ts
// main.ts
import { ValidationPipe } from '@nestjs/common';
// ...
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

```ts
// dto/create-producto.dto.ts
import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateProductoDto {
  @IsString() nombre: string;
  @IsNumber() @IsPositive() precio: number;
}
```

- **`whitelist`**: elimina propiedades extra.
- **`transform`**: castea tipos (query/body) al DTO.

## Codigos HTTP

Usando un decorador se puede devolver el codigo http en el controller

```ts
@Get('/notFound')
@HttpCode(404)
pageNotFound() {
    return 'Pagina no encontrada wacho';
}
```

## Pipes

Transforman/validan datos antes del handler.

```ts
import { ParseIntPipe } from '@nestjs/common';
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { /* ... */ }

// O custom
import { ValidateTaskIdPipe } from '/pipes/validate-task-id/validate-task-id.pipe';
@Get('/:id')
getTask(@Param('id', ValidateTaskIdPipe) id: any): Task | HttpException {
    // Se ejecuta antes de esta linea
    return this.taskService.getTask(id as number);
}
```

- Creacion de pipe con nombre "validateTask"

```bash
nest g pi tasks/pipes/validateTask
```

## Guards (Auth/Permisos)

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    return Boolean(req.headers['x-auth']); // demo
  }
}

@Get('/:id')
@UseGuards(AuthGuard) // se ejecuta antes del validateTaskIdPipie
getTask(@Param('id', ValidateTaskIdPipe) id: any): Task | HttpException {
    return this.taskService.getTask(id as number);
}
```

Usar con `@UseGuards(AuthGuard)` o a nivel módulo/controlador.

- Creacion de guard con nombre "auth"

```bash
nest g gu tasks/guards/auth
```

## Middleware

Se ejecuta **antes** del pipeline de Nest (tipo Express).

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  }
}
```

- Creacion de middleware con nombre "logger"

```bash
nest g mi tasks/logger
```

## Resource

Para cuando se quiere crear varios recursos al mismo tiempo y no primero controller, luego service, etc.
Al ejecutar el comando, consulta que capa de transporte se quiere usar:

- REST API
- GraphQL (code first)
- GraphQL (schema first)
- Microservices (non-HTTP)
- webSockets

Al elegir REST API pregunta si se quiere generar un CRUD, al colocar si, creará:

- module
- controller
- service
- dtos (create y update)
- entity

- Creacion de recursos para "users"

```bash
nest g res users
```

## Base de Datos (Persistencia)

Se puede usar cualquier base, a modo ejemplo, se usara Prisma y TypeORM

## Prisma (recomendado por DX)

https://docs.nestjs.com/recipes/prisma

1. Se instala e inicia prisma

```bash
pnpm add prisma @prisma/client
pnpm prisma init
```

2. Al usar docker, crear el archivo y ejecutarlo

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: mydb
    ports:
      - '51213:5432' # 51213 en host -> 5432 en contenedor
```

3. Levanto docker para crear contenedor con el yaml anterior

```bash
docker-compose up -d
```

4. Crear/modificar archivo de variables de entorno .env para agregar la conexión a la base

```js
DATABASE_URL = 'postgresql://user:pass@localhost:port/db_name?schema=public';
```

5. Modificar archivo /prisma/schema.prisma para crear los modelos a usar

```prisma
// Creado automaticamente
generator client {
  provider = "prisma-client-js"
  //output   = "../generated/prisma/" // comentar linea para que tome el de node_modules
}

// Creado automaticamente
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Creado por mi
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String
}
```

6. Ejecutar prisma. Esto va a ejecutar lo que este en schema.prisma para agregarlo a la db de la config que este en el archivo .env

```bash
pnpm prisma migrate dev --name init
```

7. Ejemplo de uso:

```ts
// service
import { PrismaService } from '../../prisma.service';
...
constructor(private prismaService: PrismaService) {}
...
async createTask(data: CreateTask): Promise<CreateTask> {
  return await this.prismaService.task.create({
    data,
  });
}

// module
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [...],
  providers: [..., PrismaService],
})
```

## Documentacion (swagger)
https://docs.nestjs.com/openapi/introduction

1. Se agrega como dependencia

```bash
pnpm add @nestjs/swagger
```

2. Se agrega codigo al main.ts

```ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## CORS

1. Ingresa a about:blank
2. En la consola ingresa a: fetch('http://localhost:4000/tasks'), se deberia ver error:

```js
Access to fetch at 'http://localhost:4000/tasks' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

3. Agregar en main.ts

```ts
app.enableCors();
```

4. Volver a correr fetch('http://localhost:4000/tasks') y ver que retorna una promesa

```js
Promise {<pending>}
```

5. Tratarla para ver la respuesta:

```js
fetch('http://localhost:4000/tasks')
  .then(r => r.json())
  .then(d => console.log(d))

// output
0: {id: 3, title: 'Tarea 2', status: false}
1: {id: 4, title: 'Nueva tarea wacho', status: true}
```

## Interceptors (logging, mapping, cache)

Interceptor para _cross-cutting concerns_ (logging, mapping, caching). Se usa para Transformar `data`, medir tiempos, etc.

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
@Injectable()
export class WrapInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => ({ data, ok: true })));
  }
}
```

## Exception Filters

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res
      .status(exception.getStatus())
      .json({ ok: false, message: exception.message });
  }
}
```

---

# Ciclo de vida, alcance (scope) y ModuleRef

- **Lifecycle hooks**: `OnModuleInit`, `OnModuleDestroy`, `BeforeApplicationShutdown`.
- **Scopes**: `DEFAULT` (singleton), `REQUEST` (por request), `TRANSIENT`.
- **ModuleRef**: resolver providers dinámicamente o crear instancias con scope específico.

```ts
import { Injectable, Scope } from '@nestjs/common';
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  /* ... */
}
```

---

# Cache y Logging

- **CacheModule** (memory/redis) para cachear respuestas o datos.
- **Logger**: `app.useLogger` o `Logger` de Nest; integrá con **Winston/Pino** para producción.

```ts
import { CacheModule } from '@nestjs/cache-manager';
@Module({ imports: [CacheModule.register({ ttl: 60 })] })
export class AppModule {}
```

---

# WebSockets y Microservicios (visión rápida)

- **WebSockets**: `@WebSocketGateway()` y `@SubscribeMessage()` con `socket.io` o `ws`.
- **Microservices**: `@nestjs/microservices` (TCP, Redis, NATS, Kafka). Útil para **event-driven**.

---

# Testing (Unit y E2E)

- **Unit**: testeás servicios y controladores aislados con `TestingModule`.
- **E2E**: levantás la app en memoria y pegás requests reales (supertest).

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';

describe('ProductosService', () => {
  let service: ProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductosService],
    }).compile();
    service = module.get(ProductosService);
  });

  it('crea producto', async () => {
    const p = await service.create({ nombre: 'Mate', precio: 1000 });
    expect(p.nombre).toBe('Mate');
  });
});
```

```ts
// E2E (ejemplo)
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

let app: INestApplication;
beforeAll(async () => {
  /* crear TestingModule + app.init() */
});
it('GET /productos', () =>
  request(app.getHttpServer()).get('/productos').expect(200));
```

---

# 🚀 Primer deploy de **NestJS + Prisma** en **Heroku** (con Postgres)

**Objetivo:** dejar tu API de NestJS corriendo en Heroku con una base de datos Postgres y migraciones de Prisma aplicadas.

> Ambiente asumido: **macOS** (con Homebrew). Si usás Linux/Windows avisame y te lo adapto.  
> Requisitos: tenés cuenta en Heroku y tu repo Nest listo (usa `process.env.PORT` en `main.ts`).

---

## 1) Instalar Heroku CLI y loguearte

```bash
# instalar Heroku CLI
brew tap heroku/brew
brew install heroku

# chequear
heroku --version

# login en navegador
heroku login
```

> Si no tenés `brew`: https://devcenter.heroku.com/articles/heroku-cli

---

## 2) Preparar Prisma para Postgres

Asegurate de que tu `prisma/schema.prisma` apunte a Postgres con env var:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Creá tu primera migración local y generá el cliente:

```bash
# desde el root del repo
npx prisma migrate dev --name init
npx prisma generate
```

> **Importante:** committeá la carpeta `prisma/migrations/**` al repo.

---

## 3) Scripts de `package.json`

Asegurate de tener estos scripts (podés copiar/pegar):

```json
{
  "engines": { "node": "22.x" },
  "scripts": {
    "start": "nest start",
    "build": "nest build",
    "start:prod": "node dist/main.js",
    "postinstall": "prisma generate",
    "migrate:deploy": "prisma migrate deploy",
    "seed": "prisma db seed"
  },
  "prisma": { "seed": "ts-node prisma/seed.ts" } // si vas a seedear
}
```

- `postinstall`: genera Prisma Client durante el build en Heroku.
- `migrate:deploy`: aplica todas las migraciones pendientes en la DB.
- `start:prod`: arranca la app compilada desde `dist`.

> Si usás **pnpm** en lugar de npm, más abajo hay una sección opcional.

---

## 4) Procfile (obligatorio en Heroku)

En la raíz del repo, creá un archivo **`Procfile`** (sin extensión):

```
release: pnpm run migrate:deploy
web: node dist/main.js
```

- **release**: corre antes de cada release para aplicar migraciones.
- **web**: comando que ejecuta el dyno web (tu API).

> Heroku automáticamente va a compilar tu app con `pnpm run build` durante el deploy.

---

## 5) Cierre prolijo de Prisma (opcional pero recomendado)

En `prisma.service.ts`:

```ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

En `main.ts`:

```ts
const app = await NestFactory.create(AppModule);
const prisma = app.get(PrismaService);
await prisma.enableShutdownHooks(app);
await app.listen(process.env.PORT ?? 4000);
```

---

## 6) Crear la app en Heroku y agregar Postgres

```bash
# (desde la carpeta del repo con git inicializado)
heroku create nombre-de-tu-app

# agregar Postgres (plan ejemplo)
heroku addons:create heroku-postgresql:hobby-basic -a nombre-de-tu-app

# ver variables configuradas por Heroku (incluye DATABASE_URL)
heroku config -a nombre-de-tu-app
```

### Forzar SSL en la URL (recomendado)

Algunas conexiones requieren `sslmode=require`. Si tu `DATABASE_URL` no lo trae, ejecutá:

```bash
heroku config:set DATABASE_URL="$(heroku config:get DATABASE_URL -a nombre-de-tu-app)?sslmode=require" -a nombre-de-tu-app
```

> Si más adelante usás **pgBouncer** (pooling), usá:  
> `?sslmode=require&pgbouncer=true&connection_limit=1`

---

## 7) Build & Deploy

```bash
# compilar local (opcional)
npm run build

# push a Heroku (main o master según tu rama)
git push heroku main
# o
git push heroku master
```

Durante el deploy Heroku hará:

1. Instalar dependencias → `postinstall` (→ `prisma generate`)
2. Compilar (`nest build`)
3. Fase **release** → `npm run migrate:deploy`
4. Iniciar el dyno → `node dist/main.js`

> Si querés correr migraciones manualmente:  
> `heroku run -a nombre-de-tu-app npm run migrate:deploy`

---

## 8) Seed (opcional, una sola vez)

Si tenés `prisma/seed.ts`, corrélo así:

```bash
heroku run -a nombre-de-tu-app npm run seed
```

---

## 9) Probar y ver logs

```bash
# abrir la app (si tenés algún endpoint GET en / o /health)
heroku open -a nombre-de-tu-app

# ver logs en vivo
heroku logs -t -a nombre-de-tu-app
```

---

## 10) Variables de entorno adicionales

Si tu app necesita otras env vars (JWT_SECRET, CORS_ORIGIN, etc.):

```bash
heroku config:set JWT_SECRET="loquesea" -a nombre-de-tu-app
heroku config:set CORS_ORIGIN="https://tu-front.vercel.app" -a nombre-de-tu-app
```

---

## (Opcional) Usar **pnpm** en Heroku

Si preferís deploy con `pnpm`:

```bash
heroku buildpacks:add -a nombre-de-tu-app https://github.com/pnpm/heroku-buildpack-pnpm
heroku buildpacks:add -a nombre-de-tu-app heroku/nodejs
```

En `package.json` podés agregar:

```json
{
  "scripts": {
    "heroku-postbuild": "pnpm prisma generate && pnpm build"
  }
}
```

Y en el **Procfile** reemplazar `npm` por `pnpm` si querés:

```
release: pnpm run migrate:deploy
web: node dist/main.js
```

---

## Troubleshooting común

- **Error de SSL / “connection error”**  
  Asegurate que `DATABASE_URL` tenga `?sslmode=require`. Volvé a setearla y redeployá.

- **Pool de conexiones saturado**  
  Considerá **pgBouncer** y sumale `&pgbouncer=true&connection_limit=1` a la URL.

- **Migraciones no corren**  
  Revisá que exista `Procfile` y que tenga el `release: npm run migrate:deploy`. Mirá `heroku logs` en la fase release.

- **La app no levanta**  
  Confirmá que **`main.ts`** usa `process.env.PORT` y que estás ejecutando `web: node dist/main.js`.

---

## Checklist final

- [ ] `schema.prisma` con `provider="postgresql"` y `url=env("DATABASE_URL")`
- [ ] Migraciones **commiteadas** (`prisma/migrations/**`)
- [ ] `package.json` con `postinstall`, `build`, `migrate:deploy`, `start:prod`
- [ ] **Procfile** con `release:` y `web:`
- [ ] `DATABASE_URL` en Heroku (con `sslmode=require`)
- [ ] (Opcional) Seed corrido una vez
- [ ] App responde en `https://nombre-de-tu-app.herokuapp.com` (o el dominio asignado)

---

# Buenas prácticas

- **Controladores delgados**, **servicios gordos** (dominio).
- **DTOs + ValidationPipe** global (`whitelist`, `transform`).
- **Módulos por feature**, **exports** mínimos necesarios.
- **ConfigModule** global para `.env` (sin acoplar a `process.env` en todo el código).
- **Errores HTTP** con `HttpException`/subclases (`NotFoundException`, etc.).
- **Guards** para auth/autorización; **interceptors** para logging/transformación.
- **Separá** capa de persistencia (Prisma/TypeORM) detrás de servicios/repositorios.
- **Swagger** desde el inicio para alinear modelo con consumidores.
- Linters, formateo y CI con pruebas unitarias/E2E.

---

# Errores comunes

1. Meter lógica de negocio en controladores (difícil de testear y reusar).
2. No usar DTOs/validación → endpoints frágiles e inseguros.
3. `exports` de módulos innecesarios → acoplamiento circular.
4. Dependencias request‑scoped por default → performance mala.
5. Capturar errores a mano en todos lados; en lugar de eso, **filters** o excepciones HTTP.
6. Confundir **middleware** (nivel Express) con **guards** (nivel Nest).

---

# Roadmap de crecimiento

- **Auth** con Passport/JWT, refresh tokens, RBAC/ABAC.
- **Capa de dominio** separada + **DDD**/Hexagonal.
- **Microservicios** y mensajería (eventos/colas).
- **CQRS** (`@nestjs/cqrs`) para comandos y queries en dominios grandes.
- **GraphQL** (`@nestjs/graphql`) con code‑first/schema‑first.
- **Observabilidad**: salud, métricas, tracing (OpenTelemetry).

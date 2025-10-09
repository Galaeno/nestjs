# nestjs
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

### Prisma (recomendado por DX)
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
DATABASE_URL="postgresql://user:pass@localhost:port/db_name?schema=public"
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

### TypeORM (alternativa popular)
```bash
pnpm add @nestjs/typeorm typeorm pg
```
Config inicial en `imports: [TypeOrmModule.forRoot({...})]` y repos por entidad.

















### Interceptors (logging, mapping, cache)
```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
@Injectable()
export class WrapInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => ({ data, ok: true })));
  }
}
```

### Exception Filters
```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(exception.getStatus()).json({ ok: false, message: exception.message });
  }
}
```
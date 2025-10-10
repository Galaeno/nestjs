# Guía práctica de Generadores de NestJS (`nest g …`)

> **Objetivo:** entender qué genera cada comando, cuándo usarlo, dónde va en la estructura del proyecto, cómo implementarlo con ejemplos mínimos, buenas prácticas y cómo se relaciona con el resto de piezas de Nest.  
> **Versión:** CLI moderna (Nest 10/11). El set puede variar levemente según versión.

---

## Tabla de contenido
- [application (`application`)](#application-application)
- [class (`class`, `cl`)](#class-class-cl)
- [configuration (`configuration`, `config`)](#configuration-configuration-config)
- [controller (`controller`, `co`)](#controller-controller-co)
- [decorator (`decorator`, `d`)](#decorator-decorator-d)
- [filter (`filter`, `f`)](#filter-filter-f)
- [gateway (`gateway`, `ga`)](#gateway-gateway-ga)
- [guard (`guard`, `gu`)](#guard-guard-gu)
- [interceptor (`interceptor`, `itc`)](#interceptor-interceptor-itc)
- [interface (`interface`, `itf`)](#interface-interface-itf)
- [library (`library`, `lib`)](#library-library-lib)
- [middleware (`middleware`, `mi`)](#middleware-middleware-mi)
- [module (`module`, `mo`)](#module-module-mo)
- [pipe (`pipe`, `pi`)](#pipe-pipe-pi)
- [provider (`provider`, `pr`)](#provider-provider-pr)
- [resolver (`resolver`, `r`)](#resolver-resolver-r)
- [resource (`resource`, `res`)](#resource-resource-res)
- [service (`service`, `s`)](#service-service-s)
- [sub-app (`sub-app`, `app`)](#sub-app-sub-app-app)

---

## application (`application`)
**Qué es:** Crea un *workspace* de aplicación Nest (estructura base + `main.ts`).  
**Para qué se usa:** Iniciar un proyecto desde cero.  
**Dónde va:** Crea la carpeta del proyecto.
```
my-app/
├─ src/
│  ├─ app.module.ts
│  └─ main.ts
├─ package.json
└─ tsconfig.json
```
**Cómo se implementa:**
```bash
nest new my-app
# o con el generator
nest g application my-app
```
**Recomendaciones:** Elegí gestor de paquetes (pnpm recomendado), agrega ESLint/Prettier, ValidationPipe global, Swagger si aplica.  
**Relación:** Base de todo; luego agregás módulos, servicios, controladores, etc.

---

## class (`class`, `cl`)
**Qué es:** Crea una clase simple TypeScript.  
**Para qué se usa:** Utilidades, helpers, modelos de dominio sin decoradores Nest.  
**Dónde va:** En el módulo o carpeta de dominio correspondiente.
```
src/users/domain/user.entity.ts
```
**Implementación:**
```bash
nest g class users/domain/user --flat
```
```ts
export class User {
  constructor(public readonly id: string, public name: string) {}
}
```
**Recomendaciones:** Nombrar con sufijos `*.entity.ts`, `*.helper.ts`.  
**Relación:** Usada por servicios, controladores, pipes, etc.

---

## configuration (`configuration`, `config`)
**Qué es:** Genera archivo de configuración del CLI (`nest-cli.json`).  
**Para qué se usa:** Personalizar build, assets, entradas, collection schematics.  
**Dónde va:** Raíz del proyecto.
```
nest-cli.json
```
**Implementación:**
```bash
nest g config
```
**Recomendaciones:** Útil en monorepos o para incluir `assets` (p. ej. plantillas).  
**Relación:** Afecta a la experiencia de `nest build`, `nest start`, etc.

---

## controller (`controller`, `co`)
**Qué es:** Controlador HTTP (o WebSockets, microserv) que mapea rutas.  
**Para qué se usa:** Exponer endpoints REST.  
**Dónde va:** Dentro de un módulo funcional.
```
src/users/
├─ users.controller.ts
└─ users.module.ts
```
**Implementación:**
```bash
nest g controller users
```
```ts
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }
}
```
**Recomendaciones:** Controlador fino; delegá lógica en servicios.  
**Relación:** Depende de servicios; pertenece a un módulo.

---

## decorator (`decorator`, `d`)
**Qué es:** Genera un decorador custom (métodos, clases, parámetros).  
**Para qué se usa:** Meta-programación ligera, reutilizar validaciones o marcas.  
**Dónde va:** Carpeta `common/decorators` o del dominio.
```
src/common/decorators/current-user.decorator.ts
```
**Implementación:**
```bash
nest g decorator common/decorators/current-user --no-spec
```
```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
```
**Recomendaciones:** Mantenerlos simples y testeables.  
**Relación:** Usado por controladores/guards/interceptores.

---

## filter (`filter`, `f`)
**Qué es:** *Exception filter* para transformar/externalizar errores.  
**Para qué se usa:** Uniformar respuestas de error (p. ej. 4xx/5xx).  
**Dónde va:** `common/filters` o por módulo.
```
src/common/filters/http-exception.filter.ts
```
**Implementación:**
```bash
nest g filter common/filters/http-exception
```
```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception.getStatus();
    res.status(status).json({ statusCode: status, message: exception.message });
  }
}
```
**Recomendaciones:** Aplicar globalmente o por controlador según caso.  
**Relación:** Complementa pipes/guards/interceptores.

---

## gateway (`gateway`, `ga`)
**Qué es:** *WebSocket gateway* (p. ej. Socket.IO).  
**Para qué se usa:** Comunicación en tiempo real (rooms, eventos).  
**Dónde va:** En el módulo que maneja RT.
```
src/chat/chat.gateway.ts
```
**Implementación:**
```bash
nest g gateway chat/chat
```
```ts
import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() payload: string) {
    return { ack: true, payload };
  }
}
```
**Recomendaciones:** Evitá lógica pesada; delegá a servicios.  
**Relación:** Usa servicios/repositorios; puede usar guards para auth.

---

## guard (`guard`, `gu`)
**Qué es:** Guard de autorización/autenticación.  
**Para qué se usa:** Permitir/bloquear acceso a rutas.  
**Dónde va:** `common/guards` o por módulo.
```
src/common/guards/jwt-auth.guard.ts
```
**Implementación:**
```bash
nest g guard common/guards/jwt-auth --no-spec
```
```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    return Boolean(req.user); // Ejemplo básico
  }
}
```
**Recomendaciones:** Componé con *decorators* (p. ej. `@Roles`).  
**Relación:** Interactúa con estrategias (Passport), decoradores y controladores.

---

## interceptor (`interceptor`, `itc`)
**Qué es:** Interceptor para *cross-cutting concerns* (logging, mapping, caching).  
**Para qué se usa:** Transformar `data`, medir tiempos, etc.  
**Dónde va:** `common/interceptors`.
```
src/common/interceptors/logging.interceptor.ts
```
**Implementación:**
```bash
nest g interceptor common/interceptors/logging
```
```ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const t0 = Date.now();
    return next.handle().pipe(tap(() => console.log('ms:', Date.now() - t0)));
  }
}
```
**Recomendaciones:** Idempotentes; no mezclar con lógica de dominio.  
**Relación:** Se aplican junto a pipes/filters/guards.

---

## interface (`interface`, `itf`)
**Qué es:** Interfaz TypeScript.  
**Para qué se usa:** Contratos de tipos.  
**Dónde va:** `domain/` o `types/`.
```
src/users/types/user.repository.ts
```
**Implementación:**
```bash
nest g interface users/types/user-repository --no-spec
```
```ts
export interface UserRepository {
  findOne(id: string): Promise<unknown>;
}
```
**Recomendaciones:** Úsalas para *ports* (Hexagonal).  
**Relación:** Implementadas por providers/servicios.

---

## library (`library`, `lib`)
**Qué es:** Nueva librería dentro de un **monorepo** Nest (workspace).  
**Para qué se usa:** Reutilizar lógica entre apps (auth, logger, dto).  
**Dónde va:** `libs/`.
```
libs/logger/
├─ src/
│  └─ logger.module.ts
└─ package.json
```
**Implementación:**
```bash
nest g lib logger
```
**Recomendaciones:** Exportá módulos claros y sin dependencias circulares.  
**Relación:** Consumida por apps/sub-apps.

---

## middleware (`middleware`, `mi`)
**Qué es:** Middleware de Express/Fastify.  
**Para qué se usa:** Pre-procesar requests (CORS, rate-limit, correlation-id).  
**Dónde va:** `common/middleware` o módulo HTTP.
```
src/common/middleware/correlation-id.middleware.ts
```
**Implementación:**
```bash
nest g middleware common/middleware/correlation-id
```
```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    req.correlationId = req.correlationId ?? randomUUID();
    next();
  }
}
```
**Recomendaciones:** Registrar en `configure(consumer)` del módulo.  
**Relación:** Antes de guards/pipes/interceptors.

---

## module (`module`, `mo`)
**Qué es:** Módulo de Nest (unidad de organización).  
**Para qué se usa:** Agrupar controladores, providers, imports/exports.  
**Dónde va:** Carpeta funcional.
```
src/orders/
├─ orders.module.ts
├─ orders.controller.ts
└─ orders.service.ts
```
**Implementación:**
```bash
nest g module orders
```
```ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
```
**Recomendaciones:** Módulos pequeños y enfocados; evitar *god modules*.  
**Relación:** Es el pegamento entre providers/controladores.

---

## pipe (`pipe`, `pi`)
**Qué es:** Pipe de transformación/validación.  
**Para qué se usa:** Convertir tipos, validar params/body.  
**Dónde va:** `common/pipes`.
```
src/common/pipes/parse-bigint.pipe.ts
```
**Implementación:**
```bash
nest g pipe common/pipes/parse-bigint --no-spec
```
```ts
import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    try { return BigInt(value); } catch { throw new BadRequestException('Invalid bigint'); }
  }
}
```
**Recomendaciones:** Combinarlos con `ValidationPipe` global.  
**Relación:** Antes del controlador; complementa DTOs y class-validator.

---

## provider (`provider`, `pr`)
**Qué es:** Provider genérico (inyectable).  
**Para qué se usa:** Servicios, repositorios, *useFactory*, etc.  
**Dónde va:** Dentro del módulo.
```
src/payments/payments.provider.ts
```
**Implementación:**
```bash
nest g provider payments/providers/stripe
```
```ts
import { Injectable } from '@nestjs/common';
@Injectable()
export class StripeProvider {
  charge() {/* … */}
}
```
**Recomendaciones:** Preferí `service` para lógica de dominio; `provider` para factories/tokens.  
**Relación:** Inyectado donde se necesite.

---

## resolver (`resolver`, `r`)
**Qué es:** Resolver de GraphQL.  
**Para qué se usa:** Exponer schema y *resolvers* para queries/mutations/subscriptions.  
**Dónde va:** Módulo GraphQL.
```
src/gql/users/users.resolver.ts
```
**Implementación:**
```bash
nest g resolver gql/users
```
```ts
import { Resolver, Query, Args } from '@nestjs/graphql';
@Resolver()
export class UsersResolver {
  @Query(() => String)
  hello(@Args('name') name: string) {
    return `Hola ${name}`;
  }
}
```
**Recomendaciones:** Mantener type-graph ordenado; usar DTOs/inputs.  
**Relación:** Usa services/providers; requiere módulo GraphQL configurado.

---

## resource (`resource`, `res`)
**Qué es:** *Scaffold* CRUD completo (módulo + controller + service + DTOs).  
**Para qué se usa:** Bootstrapping de recursos REST rápido.  
**Dónde va:** Nueva carpeta de recurso.
```
src/products/
├─ dto/
├─ entities/
├─ products.controller.ts
├─ products.module.ts
└─ products.service.ts
```
**Implementación:**
```bash
nest g resource products
# Elegí 'REST API', 'CRUD', etc.
```
**Recomendaciones:** Útil como base; después refactorizá a tus patrones (repos, casos de uso).  
**Relación:** Combina controller+service+module+dto/entities.

---

## service (`service`, `s`)
**Qué es:** Servicio de dominio/lógica de aplicación.  
**Para qué se usa:** Implementar casos de uso; orquestar repos, colas, APIs.  
**Dónde va:** Dentro del módulo.
```
src/users/users.service.ts
```
**Implementación:**
```bash
nest g service users
```
```ts
import { Injectable } from '@nestjs/common';
@Injectable()
export class UsersService {
  findOne(id: string) { return { id, name: 'Gonza' }; }
}
```
**Recomendaciones:** Mantener *stateless*; test unitarios con dobles.  
**Relación:** Inyectado en controladores/resolvers/gateways.

---

## sub-app (`sub-app`, `app`)
**Qué es:** Crea una sub-aplicación **dentro de un monorepo/workspace**.  
**Para qué se usa:** Microfronts/backends múltiples en el mismo repo.  
**Dónde va:** `apps/`.
```
apps/api/
├─ src/
│  ├─ app.module.ts
│  └─ main.ts
└─ package.json
```
**Implementación:**
```bash
nest g app api
```
**Recomendaciones:** Separar libs compartidas en `libs/`; usar `pnpm workspaces`.  
**Relación:** Comparte librerías con `libs/` y convive con otras apps.

---

## Tips generales
- **Convenciones de nombres:** `feature/feature.module.ts`, `feature.controller.ts`, `feature.service.ts`.
- **Evitar ciclos:** no importes módulos circularmente; extraé a `libs/` o `common/`.
- **Validación y mapeos:** DTOs con `class-validator`, pipes personalizados para tipos no triviales (p. ej. `bigint`).
- **Swagger:** anotar DTOs/Controllers con decorators (`@ApiTags`, `@ApiProperty`).
- **Testing:** `*.spec.ts` junto a los archivos; mocks para providers externos.
- **Estructura sugerida app mediana:**
```
src/
├─ common/
│  ├─ decorators/
│  ├─ filters/
│  ├─ interceptors/
│  ├─ middleware/
│  └─ pipes/
├─ modules/
│  ├─ users/
│  ├─ auth/
│  └─ payments/
├─ app.module.ts
└─ main.ts
```
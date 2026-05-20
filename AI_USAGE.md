# Reporte de Uso de Inteligencia Artificial (AI_USAGE.md)

Este documento detalla de manera transparente cómo se integró el uso de Inteligencia Artificial (IA) en el proceso de diseño, desarrollo, depuración y pruebas de esta prueba técnica, cumpliendo con los requerimientos solicitados para la evaluación.

---

## 1. Herramientas Utilizadas y Caso de Uso

La herramienta principal de asistencia en el desarrollo de este proyecto fue **Gemini** (a través de su modelo avanzado de lenguaje para desarrollo de software). 

Se utilizó activamente para los siguientes aspectos:
* **Diseño de Arquitectura:** Planificar la estructura limpia del backend en NestJS, asegurando la correcta separación de responsabilidades entre controladores, servicios, módulos y la capa de datos de Prisma.
* **Generación de Boilerplate y DTOs:** Acelerar la escritura de clases repetitivas como los Data Transfer Objects (DTOs) para la validación de peticiones de entrada mediante `class-validator`.
* **Estrategia de Testing:** Diseñar y estructurar la suite de pruebas unitarias con Jest para los controladores y servicios, así como las pruebas de integración End-to-End (E2E) con Supertest.
* **Resolución de Errores de Tipado Estricto:** Solucionar advertencias de ESLint altamente estrictas de TypeScript (`@typescript-eslint/unbound-method`, `no-unsafe-assignment`, etc.) en el ambiente de pruebas.

---

## 2. Prompts Clave que Aportaron Mayor Valor

A lo largo del desarrollo, la calidad de la interacción con la IA dependió de la precisión de las instrucciones. Los siguientes tres prompts fueron fundamentales para el éxito del proyecto:

### Prompt 1: Configuración de Contexto de Alta Fidelidad para el Frontend
*Este prompt permitió "congelar" el Backend y preparar a la IA para el siguiente paso, evitando que sugiriera cambios innecesarios y enfocándola en un código Frontend limpio y estructurado.*
> "Actúa como un Desarrollador Senior Frontend experto en React, TypeScript y Tailwind CSS. Vamos a desarrollar la interfaz de usuario para un Task Manager. Te adjunto el documento de requerimientos y el contexto del BACKEND que ya está programado al 100%, testeado y corriendo en producción. 
> Reglas cruciales: 1) No sugieras modificaciones al Backend. Toda la lógica de la UI debe adaptarse estrictamente a los contratos de la API. 2) Todo el código de React debe estar estrictamente tipado con TypeScript, prohibiendo el uso de tipos 'any' o comentarios de supresión de linter. Proponme los pasos para configurar Tailwind CSS en este proyecto de Vite y la estructura de carpetas ideal."

### Prompt 2: Resolución de Falsos Positivos de ESLint en Pruebas Unitarias
*Utilizado para solventar restricciones del compilador al desatar métodos en las pruebas unitarias de Jest.*
> "Tengo el error de ESLint `@typescript-eslint/unbound-method` en mis pruebas unitarias de NestJS al hacer `expect(authService.register).toHaveBeenCalledWith(dto)`. Sé que Jest no ejecuta la función directamente, sino que la inspecciona, pero el linter estricto no lo entiende. ¿Cómo puedo reestructurar la aserción para que sea totalmente segura ante TypeScript sin tener que desactivar la regla del linter?"

---

## 3. Limitaciones de la IA y Correcciones Manuales

Durante el desarrollo del backend, se detectó una limitación importante de la IA en la **configuración y mapeo de Prisma Service** con NestJS. 

### El Problema:
Al intentar instanciar el cliente de Prisma para conectarse de manera segura a Supabase, la IA sugirió varias configuraciones desactualizadas del ciclo de vida del NestJS IoC container que causaban errores de inyección de dependencias (`Cannot resolve dependency`) y advertencias de deprecación sobre el evento `beforeExit` de Prisma en versiones recientes (Prisma v5/v6/v7). La IA seguía sugiriendo código compatible con versiones antiguas de Prisma, lo cual rompía la compilación del backend.

### Cómo lo corregí:
Tuve que pausar la interacción con la IA, dirigirme directamente a la **documentación oficial de Prisma** y a las guías de integración de NestJS. Implementé manualmente una extensión limpia del `PrismaClient` utilizando lo indicado en la documentacion de NestJS para manejar la conexión de forma nativa y robusta:
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

```

Esta corrección manual destrabó el flujo de datos y garantizó una conexión asíncrona segura con la base de datos PostgreSQL de Supabase.

---

## 4. Decisiones de Diseño No Delegadas a la IA

Hubo decisiones críticas de arquitectura que decidí tomar por mi cuenta, basándome en criterios de escalabilidad, robustez a largo plazo y buenas prácticas de ingeniería de software:

* **Elección del Framework del Backend (NestJS vs. Express puro):** Al inicio de la planeación, la IA me propuso utilizar un enfoque minimalista basado en Express puro, argumentando que la velocidad de configuración inicial y el levantamiento del boilerplate serían mucho más rápidos para cumplir con los tiempos de la prueba técnica. Sin embargo, decidí voluntariamente rechazar esa sugerencia y optar firmemente por **NestJS**.
    * *Justificación:* Considero que para construir software profesional y mantenible no se deben tomar atajos que sacrifiquen la estructura. NestJS provee una base nativa y robusta para TypeScript que Express no ofrece sin configuraciones externas propensas a errores. Además, NestJS utiliza un sistema de inyección de dependencias y una arquitectura modular que me obliga a trabajar bajo principios de **Arquitectura Limpia (Clean Architecture)** y SOLID desde el primer minuto. Delegar esto a Express habría significado desaprovechar la oportunidad de demostrar un estándar técnico elevado, organizado y listo para escalar en un entorno de producción real.

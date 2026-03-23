import path from 'node:path';
import serviceDefinitions from './services.json';
import { TechnicalError } from '../Exceptions/TechnicalError';

interface ServiceDefinition {
  name: string;
  module: string;
  class: string;
  dependencies: string[];
}

export class Container {
  private instances: Map<string, object> = new Map();

  register(name: string, instance: object): void {
    this.instances.set(name, instance);
  }

  get<T>(name: string): T {
    const instance = this.instances.get(name);
    if (!instance) {
      throw new TechnicalError(`Service not found: ${name}`);
    }
    return instance as T;
  }

  async boot(): Promise<void> {
    for (const definition of serviceDefinitions as ServiceDefinition[]) {
      const deps = definition.dependencies.map((depName) => {
        const dep = this.instances.get(depName);
        if (!dep) {
          throw new TechnicalError(
            `Dependency "${depName}" not found for service "${definition.name}". Make sure it is registered before "${definition.name}".`
          );
        }
        return dep;
      });

      const modulePath = path.resolve(__dirname, definition.module);
      const mod = await import(modulePath);
      const ServiceClass = mod[definition.class];

      if (!ServiceClass) {
        throw new TechnicalError(
          `Class "${definition.class}" not found in module "${definition.module}"`
        );
      }

      const instance = new ServiceClass(...deps);
      this.instances.set(definition.name, instance);
    }
  }
}

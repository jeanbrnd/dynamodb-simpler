import { SchemaDefinition } from "./types";

export default class Schema<T> {
  private schema: SchemaDefinition<T>;

  constructor(schema: SchemaDefinition<T>) {
    this.schema = schema;
  }

  validate(data: Partial<T>): T {
    const result: any = {};
    for (const key in this.schema) {
      const field = this.schema[key];
      const value = data[key];

      if (field.required && value === undefined) {
        throw new Error(`O campo "${key}" é obrigatório.`);
      }
      result[key] = value ?? field.default;
    }
    return result as T;
  }
}

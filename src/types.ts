export type SchemaField<T> = {
  type: "string" | "number" | "boolean";
  required?: boolean;
  default?: T;
};

export type SchemaDefinition<T> = {
  [K in keyof T]: SchemaField<T[K]>;
};

export type DynamoConfig = {
  tableName: string;
  autoCreateTable?: boolean;
};

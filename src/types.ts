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

export type QueryOptions = {
  consistentRead?: boolean; 
  returnValues?: "ALL_OLD" | "ALL_NEW" | "UPDATED_OLD" | "UPDATED_NEW" | "NONE"; 
};

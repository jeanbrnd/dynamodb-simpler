import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    ScanCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import Schema from "./schema.js";
  import { createTableIfNotExists } from "./utils.js";
  import { DynamoConfig } from "./types.js";
  
  export default class Model<T> {
    private client: DynamoDBDocumentClient;
    private tableName: string;
    private schema: Schema<T>;
  
    constructor(client: DynamoDBClient, config: DynamoConfig, schema: Schema<T>) {
      this.client = DynamoDBDocumentClient.from(client);
      this.tableName = config.tableName;
      this.schema = schema;
  
      if (config.autoCreateTable) {
        createTableIfNotExists(client, this.tableName);
      }
    }
  
    async create(data: Partial<T>): Promise<T> {
      try {
        const item = this.schema.validate(data);
        await this.client.send(new PutCommand({ TableName: this.tableName, Item: item as any }));
        return item;
      } catch (error: any) {
        throw new Error(`Erro ao criar item: ${error.message}`);
      }
    }
  
    async findById(id: string): Promise<T | null> {
      try {
        const result = await this.client.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
        return result.Item ? (result.Item as T) : null;
      } catch (error: any) {
        throw new Error(`Erro ao buscar item por ID: ${error.message}`);
      }
    }
  
    async findAll(): Promise<T[]> {
      try {
        const result = await this.client.send(new ScanCommand({ TableName: this.tableName }));
        return result.Items as T[];
      } catch (error: any) {
        throw new Error(`Erro ao buscar todos os itens: ${error.message}`);
      }
    }
  }
  
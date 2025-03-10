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

export default class Model<T extends Record<string, any>> {
  private client: DynamoDBDocumentClient;
  private tableName: string;
  private schema: Schema<T>;

  constructor(client: DynamoDBClient, config: DynamoConfig, schema: Schema<T>) {
    this.client = DynamoDBDocumentClient.from(client);
    this.tableName = config.tableName;
    this.schema = schema;

    if (config.autoCreateTable) {
      createTableIfNotExists(client, this.tableName).catch(console.error);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    const item = this.schema.validate(data);
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: item as Record<string, any> }));
    return item;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.client.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    return result.Item ? (result.Item as T) : null;
  }

  async findAll(): Promise<T[]> {
    const result = await this.client.send(new ScanCommand({ TableName: this.tableName }));
    return (result.Items as T[]) ?? [];
  }
}

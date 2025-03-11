import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Schema from "./schema.js";
import { createTableIfNotExists } from "./utils.js";
import { DynamoConfig, QueryOptions } from "./types.js";

interface QueryParams<T> {
  where: Partial<T>;
  data?: Partial<T>;
  options?: QueryOptions;
}

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

  async create(params: QueryParams<T>): Promise<T> {
    const item = this.schema.validate(params.data!);
    await this.client.send(
      new PutCommand({ TableName: this.tableName, Item: item, ...params.options })
    );
    return item;
  }

  async findOne(params: QueryParams<T>): Promise<T | null> {
    const result = await this.client.send(
      new GetCommand({ TableName: this.tableName, Key: params.where, ...params.options })
    );
    return result.Item ? (result.Item as T) : null;
  }

  async findAll(params: QueryParams<T>): Promise<T[]> {
    const result = await this.client.send(
      new ScanCommand({ TableName: this.tableName, ...params.options })
    );
    return (result.Items as T[]) ?? [];
  }

  async findOrCreate(params: QueryParams<T>): Promise<T> {
    const existing = await this.findOne({ where: params.where });
    if (existing) return existing;
    return this.create(params);
  }

  async update(params: QueryParams<T>): Promise<T | null> {
    if (!params.data) throw new Error("Data is required for update");
    const result = await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: params.where,
        UpdateExpression: "set " +
          Object.keys(params.data).map((key) => `#${key} = :${key}`).join(", "),
        ExpressionAttributeNames: Object.fromEntries(
          Object.keys(params.data).map((key) => [`#${key}`, key])
        ),
        ExpressionAttributeValues: Object.fromEntries(
          Object.entries(params.data).map(([key, value]) => [`:${key}`, value])
        ),
        ReturnValues: "ALL_NEW",
        ...params.options,
      })
    );
    return result.Attributes as T;
  }


  async delete(params: QueryParams<T>): Promise<boolean> {
    await this.client.send(
      new DeleteCommand({ TableName: this.tableName, Key: params.where, ...params.options })
    );
    return true;
  }
}

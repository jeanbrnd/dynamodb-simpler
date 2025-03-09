import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import Schema from "./schema.js";
import Model from "./model.js";
import { DynamoConfig } from "./types.js";

export default class DynamoClient {
  private client: DynamoDBClient;

  constructor(config: DynamoDBClientConfig) {
    this.client = new DynamoDBClient(config);
  }

  registerModel<T>(config: DynamoConfig, schema: Schema<T>): Model<T> {
    return new Model<T>(this.client, config, schema);
  }
}

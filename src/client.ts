import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import Schema from "./schema";
import Model from "./model";
import { DynamoConfig } from "./types";

export default class DynamoClient {
  private client: DynamoDBClient;

  constructor(config: DynamoDBClientConfig) {
    this.client = new DynamoDBClient(config);
  }

  registerModel<T>(config: DynamoConfig, schema: Schema<T>): Model<T> {
    return new Model<T>(this.client, config, schema);
  }
}

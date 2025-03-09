import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

export async function createTableIfNotExists(client: DynamoDBClient, tableName: string) {
  try {
    const command = new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    });

    await client.send(command);
   
  } catch (error: any) {
    if (error.name !== "ResourceInUseException") {
      throw new Error(error);
    }
  }
}

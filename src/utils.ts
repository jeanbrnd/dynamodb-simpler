import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";

async function tableExists(client: DynamoDBClient, tableName: string): Promise<boolean> {
  const { TableNames } = await client.send(new ListTablesCommand({}));
  return TableNames?.includes(tableName) ?? false;
}

export async function createTableIfNotExists(client: DynamoDBClient, tableName: string): Promise<boolean> {
  try {
    if (await tableExists(client, tableName)) {
      return false; 
    }

    const command = new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    });

    await client.send(command);
    return true; 
  } catch (error) {
    if (error instanceof Error && error.name !== "ResourceInUseException") {
      throw error;
    }
    return false;
  }
}

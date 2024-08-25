import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger.mjs'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todoAccess')

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE ?? ''
  ) {}

  async getTodos(userId: string): Promise<any[]> {
    logger.info('Getting all todo items')
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()
    return result.Items ?? []
  }

  async getTodo(userId: string, todoId: string): Promise<any> {
    logger.info(`Getting todo item: ${todoId}`)
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId and todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      })
      .promise()

    const todos = result.Items ?? []
    const todoItem = todos[0]
    return todoItem
  }

  async createTodo(newTodo): Promise<any> {
    logger.info(`Creating new todo item: ${newTodo.todoId}`)
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: newTodo
      })
      .promise()
    return newTodo
  }

  async updateTodo(
    userId: string,
    todoId: string,
    updateData: any
  ): Promise<void> {
    logger.info(`Updating a todo item: ${todoId}`)
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
          ':n': updateData.name,
          ':due': updateData.dueDate,
          ':dn': updateData.done
        }
      })
      .promise()
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: { userId, todoId }
      })
      .promise()
  }

  async saveImgUrl(
    userId: string,
    todoId: string,
    bucketName: string
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
        }
      })
      .promise()
  }
}

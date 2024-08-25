import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { TodoAccess } from '../dataLayer/todoAccess'
import { decode } from 'jsonwebtoken'

import * as dotenv from 'dotenv'
dotenv.config()

const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<any[]> {
  const userId: string = getUserId(jwtToken)
  return todoAccess.getTodos(userId)
}

export async function getTodo(jwtToken: string, todoId: string): Promise<any> {
  const userId: string = getUserId(jwtToken)
  return todoAccess.getTodo(userId, todoId)
}

export async function createTodo(
  jwtToken: string,
  newTodoData: any
): Promise<any> {
  const todoId = uuid.v4()
  const userId = getUserId(jwtToken)
  const createdAt = new Date().toISOString()
  const done = false
  const newTodo = { todoId, userId, createdAt, done, ...newTodoData }
  return todoAccess.createTodo(newTodo)
}

export async function updateTodo(
  jwtToken: string,
  todoId: string,
  updateData: any
): Promise<void> {
  const userId = getUserId(jwtToken)
  return todoAccess.updateTodo(userId, todoId, updateData)
}

export async function deleteTodo(
  jwtToken: string,
  todoId: string
): Promise<void> {
  const userId = getUserId(jwtToken)
  return todoAccess.deleteTodo(userId, todoId)
}

export async function generateUploadUrl(
  jwtToken: string,
  todoId: string
): Promise<string> {
  const userId = getUserId(jwtToken)
  const bucketName = process.env.IMAGES_S3_BUCKET ?? ''
  const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION ?? '', 10)
  const s3 = new AWS.S3({ signatureVersion: 'v4' })
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
  await todoAccess.saveImgUrl(userId, todoId, bucketName)
  return signedUrl
}

function getUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken)
  return decodedJwt?.sub as string
}

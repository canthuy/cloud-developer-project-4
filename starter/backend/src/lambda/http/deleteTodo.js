import { deleteTodo } from '../../businessLogic/todos'
import { getToken } from '../../utils/getToken.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const jwtToken = getToken(event)

  try {
    await deleteTodo(jwtToken, todoId)
    logger.info(`Successfully deleted todo item: ${todoId}`)
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: undefined
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error })
    }
  }
}

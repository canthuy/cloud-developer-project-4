import { createTodo } from '../../businessLogic/todos'
import { getToken } from '../../utils/getToken'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export async function handler(event: any) {
  const newTodo = JSON.parse(event.body)
  const jwtToken = getToken(event)

  try {
    const newTodoItem = await createTodo(jwtToken, newTodo)
    logger.info('Successfully created a new todo item.')
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ newTodoItem })
    }
  } catch (error: any) {
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

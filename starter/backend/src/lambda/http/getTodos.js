import { getTodos } from '../../businessLogic/todos'

export async function handler(event) {
  const jwtToken = getToken(event)

  try {
    const todoList = await getTodos(jwtToken)
    logger.info('Successfully retrieved todolist')
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ todoList })
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

import { getTodos } from '../../businessLogic/todos'
import { getToken } from '../../utils/getToken'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

export async function handler(event: any) {
  const jwtToken = getToken(event)
  // try {
  const todoList = await getTodos(jwtToken)
  logger.info('Successfully retrieved todolist')
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },

    body: JSON.stringify({ todoList })
  }
  // } catch (error: any) {
  //   logger.error(`Error: ${error.message}`)
  //   return {
  //     statusCode: 500,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Headers': 'Content-Type',
  //       'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  //     },
  //     body: JSON.stringify({ error })
  //   }
  // }
}

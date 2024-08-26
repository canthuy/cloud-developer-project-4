import { generateUploadUrl } from '../../businessLogic/todos'
import { getToken } from '../../utils/getToken'
import { createLogger } from '../../utils/logger'

const logger = createLogger('uploadUrl')

export async function handler(event: any) {
  const todoId = event.pathParameters.todoId
  const jwtToken = getToken(event)

  try {
    const signedUrl = await generateUploadUrl(jwtToken, todoId)
    logger.info('Successfully created signed url.')
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ uploadUrl: signedUrl })
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

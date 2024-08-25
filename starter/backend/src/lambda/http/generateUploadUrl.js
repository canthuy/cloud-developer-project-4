export async function handler(event) {
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

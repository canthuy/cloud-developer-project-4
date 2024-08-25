export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  try {
    await updateTodo(jwtToken, todoId, updatedTodo)
    logger.info(`Successfully updated the todo item: ${todoId}`)
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

import { parseUserId } from '../auth/utils'

export function getUserId(event: any) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

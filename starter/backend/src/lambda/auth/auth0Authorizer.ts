import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import jwksRsa from 'jwks-rsa'

const logger = createLogger('auth')

const jwksUrl =
  'https://dev-skho8kmk1c4a00ld.us.auth0.com/.well-known/jwks.json'

const client = jwksRsa({
  jwksUri: jwksUrl
})

export async function handler(event: any) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e: any) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: any) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const certSigningKey: any = await client.getSigningKey(jwt?.header.kid)

  return jsonwebtoken.verify(token, certSigningKey?.publicKey, {
    algorithms: ['RS256']
  })
}

function getToken(authHeader: any) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

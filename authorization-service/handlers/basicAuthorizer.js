'use strict';

export const basicAuthorizer = async (event) => {
    console.log('authorizer event', event);

    const {headers, methodArn} = event
    const headerValue = headers['Authorization']
    const base64Token = getBase64Token(headerValue)
    const token = convertToAscii(base64Token)
    const [username, pwd] = token.split(':')
    const effect = process.env[username] === pwd ? EFFECT.ALLOW : EFFECT.DENY
    const response = generateResponse(username, effect, methodArn)
    console.log('auth response', response)
    return response
};

export function getBase64Token(headerValue) {
    if (!headerValue) {
        return null
    }
    const parts = headerValue.split('Basic ')
    return parts.length === 2 ? parts[1] : null
}

export function convertToAscii(base64String) {
    return Buffer.from(base64String, 'base64').toString('utf-8')
}

const EFFECT = {
    ALLOW: 'Allow',
    DENY: 'Deny'
}

const generatePolicyDocument = (effect, resource) => {
    return {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
        }]
    }
};

const generateResponse = (principalId, effect, resource) => {
    return {
        principalId,
        policyDocument: generatePolicyDocument(effect, resource),
    };
};

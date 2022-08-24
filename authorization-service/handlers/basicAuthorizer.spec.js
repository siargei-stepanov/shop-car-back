import {getBase64Token, convertToAscii, basicAuthorizer} from './basicAuthorizer.js'

describe('basicAuthorizer', () => {
    it('getBase64Token', () => {
        expect(getBase64Token('Basic test123')).toEqual('test123')
        expect(getBase64Token('Bearer test123')).toBeNull()
        expect(getBase64Token('')).toBeNull()
        expect(getBase64Token(undefined)).toBeNull()
    })

    it('convertToAscii', () => {
        expect(convertToAscii('dGVzdF91c2VyOnRlc3RfcHdk')).toEqual('test_user:test_pwd')
    })

    it('should check password', async () => {
        global.process.env['test_user'] = 'test_pwd'
        const event = {
            headers: {
                Authorization: 'Basic dGVzdF91c2VyOnRlc3RfcHdk'
            },
            methodArn: 'method'
        }
        const response = await basicAuthorizer(event)
        expect(response.principalId).toEqual('test_user')
        expect(response.policyDocument.Statement[0].Effect).toEqual('Allow')
    })
})

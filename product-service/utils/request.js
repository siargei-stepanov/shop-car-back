import {headers} from '../constants/headers.js'

export const handleRequest = async (event, cb) => {
    console.log('Request event', event)
    try {
        const response = await cb(event)
        return {
            statusCode: response.statusCode,
            headers,
            body: JSON.stringify(response.body)
        }
    } catch(error) {
        console.log('Request failed with error', error)
        return {
            statusCode: error.statusCode || 500,
            headers,
            body: JSON.stringify(error)
        }
    }
}
'use strict';
import { handleRequest } from "../../common/request.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

export const importProduct = async (event) => {
    console.log('import product event', event)
    const fileName = event.queryStringParameters.name
    try {

        const client = new S3Client({region: 'eu-west-1'});
        const putObjectParams = {Key: `upload/${fileName}`, Bucket: 'car-app-upload'}
        const command = new PutObjectCommand(putObjectParams);
        const url = await getSignedUrl(client, command);
        return {
            statusCode: 200,
            body: url,
        };
    } catch (error) {
        console.log('error in import product', error)
        return {
            statusCode: 500,
            body: error,
        };
    }
}

export const importProductFile = async (event) => handleRequest(event, importProduct);

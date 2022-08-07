'use strict';
import { handleRequest } from "../../common/request.js";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import csv from 'csv-parser';

const BUCKET_NAME = 'car-app-import-bucket'

export const fileParser = async (event) => {
    console.log('import file parser event', event)
    try {
        await processRecords(event.Records)
        return {
            statusCode: 200,
            body: "Parsed",
        };
    } catch(error) {
        console.log('error in product parsing', error)
        return {
            statusCode: 500,
            body: error,
        };
    }
    
}

export const importFileParser = async (event) => handleRequest(event, fileParser);

const processRecords = async (fileRecords) => {
    const promises = fileRecords.map(async (fileRecord) => await processFileRecord(fileRecord))
    await Promise.all(promises)
}

const processFileRecord = async (fileRecord) => {
    const key = fileRecord.s3.object.key
    
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${key}`
    };
    const client = new S3Client({region: 'eu-west-1'}); 
    const stream = await client.send(new GetObjectCommand(params));

    await new Promise((resolve, reject) => {
        stream.Body.pipe(csv())
            .on('data', data => processProduct(data))
            .on('error', reject)
            .on('end', resolve)
    });

    await client.send(new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${key}`,
        Key: key.replace('uploaded', 'parsed'),
    }))

    await client.send(new DeleteObjectCommand(params));
}

const processProduct = (line) => {
    console.log('parsed product', line);
}

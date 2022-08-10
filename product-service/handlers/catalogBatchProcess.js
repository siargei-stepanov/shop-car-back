'use strict';
import {handleRequest} from "../common/request.js";
import {create} from "./createProduct.js";
import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";

export const batchProcess = async (event) => {
    const promises = []
    event.Records.forEach((record) => {
        try {
            promises.push(create(record))
        } catch (e) {
            console.log('cannot create batch product', e)
        }
    })
    await Promise.all(promises)

    // send emails
    const count = event.Records.length
    const client = new SNSClient({region: 'eu-west-1'})
    const command = new PublishCommand({
        Subject: "New products were imported",
        Message: `New ${count} products were added`,
        TopicArn: process.env.SNS_ARN
    })
    await client.send(command)

    return {
        statusCode: 200,
        body: "success batch process",
    };
};

export const catalogBatchProcess = async (event) => handleRequest(event, batchProcess)

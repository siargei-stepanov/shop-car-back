'use strict';
import {handleRequest} from "../common/request.js";
import {create} from "./createProduct.js";

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
    return {
        statusCode: 200,
        body: "success batch process",
    };
};

export const catalogBatchProcess = async (event) => handleRequest(event, batchProcess)

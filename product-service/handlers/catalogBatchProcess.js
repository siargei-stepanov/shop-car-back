'use strict';
import {handleRequest} from "../common/request.js";
import {create} from "./createProduct.js";

export const batchProcess = async (event) => {
    console.log('batch process event', event)
    event.Records.forEach((record) => {
        try {
            const result = create(record)
            result.then(data => {
                console.log('inside result of record batch', data)
            })
            console.log('result of record batch', result)
        } catch (e) {
            console.log('cannot create batch product', error)
        }
    })
    return {
        statusCode: 200,
        body: "success batch process",
    };
};

export const catalogBatchProcess = async (event) => handleRequest(event, batchProcess)

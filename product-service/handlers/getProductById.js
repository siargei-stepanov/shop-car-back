'use strict';
import {products} from "../constants/products.js";
import {headers} from "../constants/headers.js"

export const getProductById = async (event) => {
    const productId = event.pathParameters.productId;
    const product = products.find((product) => +product.id === +productId);

    if (!product) {
        return {
            statusCode: 404,
            headers,
            body: "Product not found"
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(product),
    };
};

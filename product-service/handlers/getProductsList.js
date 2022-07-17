'use strict';
import {products} from "../constants/products.js";
import {headers} from "../constants/headers.js"

export const getProductsList = async () => {
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products),
    };
};

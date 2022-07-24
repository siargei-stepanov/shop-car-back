'use strict';
import {headers} from "../constants/headers.js"
import { getDBOptions } from "../utils/db.js";
import pg from "pg";

const {Client} = pg
const DB_OPTIONS = getDBOptions(process.env)

export const getProductById = async (event) => {
    const productId = event.pathParameters.productId;
    const client = new Client(DB_OPTIONS)
    await client.connect()

    try {
        const query = `select p.id, p.manufacturer, p.model, p.price, s.count from products p join stocks s on p.id=s.product_id where p.id='${productId}`
        const {rows: products} = await client.query(query)

        if (products.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: "Product not found"
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(products[0]),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify(error),
        };
    } finally {
        client.end()
    }
};

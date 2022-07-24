'use strict';
import {headers} from "../constants/headers.js"
import { getDBOptions } from "../utils/db.js";
import pg from "pg";

const {Client} = pg
const DB_OPTIONS = getDBOptions(process.env)

export const createProduct = async (event) => {
    console.log('event', JSON.stringify(event))
    let product
    try {
        product = JSON.parse(event.body)
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify(error),
        };
    }
    const client = new Client(DB_OPTIONS)
    await client.connect()

    try {
        const {manufacturer, model, img, price, count} = product
        const query = `insert into products (manufacturer, model, img, price) values
            ('${manufacturer}', '${model}', '${img}', ${price}) RETURNING id`
        const {rows: productRow} = await client.query(query)
        const [{id: newProductId}] = productRow
        console.log('new product id', newProductId )

        const query2 = `insert into stocks (product_id, count) values ('${newProductId}', '${count}')`
        await client.query(query2)

        return {
            statusCode: 201,
            headers,
            body: "",
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

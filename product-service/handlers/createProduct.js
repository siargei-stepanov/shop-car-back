'use strict';
import { executeTransaction } from "../utils/db.js";
import {handleRequest} from "../utils/request.js";

export const create = async (event) => {
    let product
    try {
        product = JSON.parse(event.body)
        if (!product.manufacturer || !product.model || !product.price || !product.count) {
            return {
                statusCode: 400,
                body: "Incorrect product model. Missing manufacturer, model, price or count"
            }
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: "Cannot parse request body",
        };
    }

    return executeTransaction(async (client) => {
        const {manufacturer, model, img, price, count} = product
        const queryProduct = `insert into products (manufacturer, model, img, price) values
            ('${manufacturer}', '${model}', '${img}', ${price}) RETURNING id`
        const {rows: productRow} = await client.query(queryProduct)
        const [{id: newProductId}] = productRow

        const queryStocks = `insert into stocks (product_id, count) values ('${newProductId}', '${count}')`
        await client.query(queryStocks)

        return {
            statusCode: 201,
            body: "",
        };
    })
};

export const createProduct = async (event) => handleRequest(event, create)
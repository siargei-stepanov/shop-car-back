'use strict';
import { executeTransaction } from '../utils/db.js';
import { handleRequest } from '../common/request.js';

export const create = async (event) => {
  let product;
  try {
    product = JSON.parse(event.body);
    if (!product.manufacturer || !product.model || !product.price || !product.count) {
      return {
        statusCode: 400,
        body: 'Incorrect product model. Missing manufacturer, model, price or count',
      };
    }
  } catch (error) {
    console.log('parsing error', error);
    return {
      statusCode: 400,
      body: 'Cannot parse request body',
    };
  }

  return executeTransaction(async (client) => {
    const { manufacturer, model, img, price, count } = product;
    const queryProduct = `insert into products (manufacturer, model, img, price) values
            ($1, $2, $3, $4) RETURNING id`;
    const { rows: productRow } = await client.query(queryProduct, [manufacturer, model, img, price]);
    const [{ id: newProductId }] = productRow;

    const queryStocks = `insert into stocks (product_id, count) values ($1, $2)`;
    await client.query(queryStocks, [newProductId, count]);
    return {
      statusCode: 201,
      body: '',
    };
  });
};

export const createProduct = async (event) => handleRequest(event, create);

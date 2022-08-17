'use strict';
import { getDBClient } from '../utils/db.js';
import { handleRequest } from '../common/request.js';

export const getProduct = async (event) => {
  const productId = event.pathParameters.productId;
  let client;
  try {
    client = getDBClient();
    await client.connect();

    const query = `select p.id, p.manufacturer, p.model, p.price, s.count from products p join stocks s on p.id=s.product_id where p.id=$1`;
    const { rows: products } = await client.query(query, [productId]);

    if (products.length === 0) {
      return {
        statusCode: 404,
        body: 'Product not found',
      };
    }

    return {
      statusCode: 200,
      body: products[0],
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  } finally {
    client.end();
  }
};

export const getProductById = async (event) => handleRequest(event, getProduct);

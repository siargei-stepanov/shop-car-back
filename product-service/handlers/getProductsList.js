'use strict';
import { getDBClient } from '../utils/db.js';
import { handleRequest } from '../common/request.js';

export const getProducts = async () => {
  let client;
  try {
    client = getDBClient();
    await client.connect();

    const query =
      'select p.id, p.manufacturer, p.model, p.img, p.price, s.count from products p join stocks s on p.id=s.product_id';
    const { rows: products } = await client.query(query);

    return {
      statusCode: 200,
      body: products,
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

export const getProductsList = async (event) => handleRequest(event, getProducts);

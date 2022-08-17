import { getProducts } from './getProductsList.js';
import * as dbUtils from '../utils/db.js';
jest.mock('../utils/db.js');

describe('getProductsList', () => {
  let queryFn, connectFn, endFn;

  beforeEach(() => {
    connectFn = jest.fn().mockResolvedValue();
    queryFn = jest.fn();
    endFn = jest.fn();
    dbUtils.getDBClient.mockReturnValue({
      connect: connectFn,
      query: queryFn,
      end: endFn,
    });
  });

  afterEach(() => {
    dbUtils.getDBClient.mockRestore();
  });

  it('should get products', async () => {
    const dbProducts = [{ id: 1 }];
    queryFn.mockResolvedValue({ rows: dbProducts });

    const result = await getProducts();
    const products = result.body;

    expect(queryFn).toHaveBeenCalled();
    expect(result.statusCode).toBe(200);
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products).toStrictEqual(dbProducts);
    expect(endFn).toHaveBeenCalled();
  });

  it('should get products', async () => {
    const error = { message: 'Something wrong' };
    queryFn.mockRejectedValue(error);

    const result = await getProducts();

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(error);
    expect(endFn).toHaveBeenCalled();
  });
});

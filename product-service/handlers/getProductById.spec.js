import {getProduct} from "./getProductById.js";
import * as dbUtils from "../utils/db.js";
jest.mock("../utils/db.js");

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

  
    it('should get product by id', async () => {
        const productId = 1
        const dbProducts = [{ id: productId }];
        queryFn.mockResolvedValue({ rows: dbProducts });
        const event = {pathParameters: {productId}}

        const result = await getProduct(event)

        expect(queryFn).toHaveBeenCalled()
        expect(result.statusCode).toBe(200)
        expect(result.body).toStrictEqual(dbProducts[0])
        expect(endFn).toHaveBeenCalled()
    })

    it('should return 404 when no such product exists', async () => {
        const productId = 999
        const event = {pathParameters: {productId}}
        queryFn.mockResolvedValue({ rows: [] });
        const result = await getProduct(event)

        expect(result.statusCode).toBe(404)
        expect(result.body).toEqual("Product not found")
    })
})

import {getProductById} from "./getProductById.js";

describe('getProductsList', () => {
    it('should get product by id', async () => {
        const productId = 1
        const event = {pathParameters: {productId}}
        const result = await getProductById(event)
        const product = JSON.parse(result.body)

        expect(result.statusCode).toBe(200)
        expect(product.id).toBe(productId)
    })

    it('should return 404 when no such product exists', async () => {
        const productId = 999
        const event = {pathParameters: {productId}}
        const result = await getProductById(event)

        expect(result.statusCode).toBe(404)
    })
})

import {getProductsList} from "./getProductsList.js";

describe('getProductsList', () => {
    it('should get products', async () => {
        const result = await getProductsList()
        const products = JSON.parse(result.body)

        expect(result.statusCode).toBe(200)
        expect(Array.isArray(products)).toBe(true)
        expect(products.length).toBeGreaterThan(0)
    })
})

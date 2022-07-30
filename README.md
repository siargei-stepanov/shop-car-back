# shop-car-back
This is education repo for AWS course

Provides API for car shop

List of products:
GET https://3xe5zb5ot5.execute-api.eu-west-1.amazonaws.com/products

Show product by id:
GET https://3xe5zb5ot5.execute-api.eu-west-1.amazonaws.com/products/{id}

Create a product:
POST https://3xe5zb5ot5.execute-api.eu-west-1.amazonaws.com/products

Sample product:
```{"manufacturer": "Volkswagen", "model":"Golf", "img":"", "price":"12000", "count":"3"}```
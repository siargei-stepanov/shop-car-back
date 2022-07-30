CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists products (
id UUID NOT NULL DEFAULT uuid_generate_v4(),
manufacturer text not null ,
img text,
model text,
price bigint,
CONSTRAINT id_products PRIMARY KEY ( id )
);

create table if not exists stocks (
product_id UUID not null,
count integer,
constraint fk_stocks_product_id foreign key(product_id)
references products(id) on delete cascade on update no action
);

insert into products (manufacturer, model, img, price) values
('Mercedes', 'C43 AMG', 'https://cdn.motor1.com/images/mgl/jllxgl/s3/2023-mercedes-amg-c43-front-3-4.jpg', 44000),
('Mercedes', 'A210', 'https://cdn5.vedomosti.ru/crop/image/2018/9x/wcz9w/original-15xv.jpg?height=698&width=1240', 31000),
('Audi', 'R8', 'https://cdn.motor1.com/images/mgl/JmVR6/s1/2019-audi-r8-onlocation.jpg', 70000);

insert into stocks (product_id, count) values
((select id from products where model = 'C43 AMG'), 2),
((select id from products where model = 'A210'), 5),
((select id from products where model = 'R8'), 1);


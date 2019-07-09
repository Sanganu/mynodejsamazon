use dubootcamp;

create table master_product(
product_id int auto_increment not null,
product_name varchar(25) not null,
price float,
quantity int,
primary key(product_id));

create table order_products(
order_id int auto_increment not null,
product_id int not null,
order_details varchar(15),
customer_name varchar(30),
order_qunatity int,shipping_address varchar(45),
primary key(order_id),
foreign key(product_id) references master_product(product_id));


insert into master_product(product_name,price,quantity)
values('Apple Laptop',1100.90,200);


insert into master_product(product_name,price,quantity)
values('Apple ipad',900.90,220);


insert into master_product(product_name,price,quantity)
values('Apple iPhone',700,500);


insert into master_product(product_name,price,quantity)
values('Apple Watch',1200.90,233);

insert into master_product(product_name,price,quantity)
values('Apple Earbuds',62.20,1233);


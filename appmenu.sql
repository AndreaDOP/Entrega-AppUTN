-- Databese para appFinal --
create database appmenu;

-- selecciono la Database --
use appmenu;

-- creamos la tabla usuarios-clientes menuclik --
create table usuarios(
idUsuarios int unsigned not null auto_increment,
nombre varchar(100) not null,
email varchar(200) not null,
phone bigint not null,
primary key (idUsuarios)
);

create table productos(
idMenus int unsigned not null auto_increment,
Menu varchar(80) not null,
precio int not null,
primary key(idMenus)
);

insert into productos values(null, "Bondiola", 2100);
insert into productos values(null, "Suprema", 1800);
insert into productos values(null, "Lomo",2500);
insert into productos values(null, "Ensalada Rubí", 990);
insert into productos values(null, "Ensalada Salmón", 2100);
insert into productos values(null, "Champiñones Rellenos", 1500);
insert into productos values(null, "Ravioles", 1990);
insert into productos values(null, "Guiso", 2000);
insert into productos values(null, "Wok", 1800);




create table pedidos(
idPedidos int unsigned not null auto_increment,
idUsuarios int unsigned not null,
idMenus int unsigned not null,
cantidad int not null,
precio int not null,
total int not null,
data_create timestamp default current_timestamp,
primary key(idPedidos),
foreign key(idUsuarios) references usuarios(idUsuarios),
foreign key(idmenus) references productos(idMenus)
);
CREATE TABLE `art` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `image` text NOT NULL UNIQUE,
  `order` integer NOT NULL,
  `featured` integer DEFAULT false NOT NULL,
  `hidden` integer DEFAULT false NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-01','Artwork 01','art-01.webp',0,1,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-02','Artwork 02','art-02.webp',1,1,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-03','Artwork 03','art-03.webp',2,1,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-04','Artwork 04','art-04.webp',3,1,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-05','Artwork 05','art-05.webp',4,1,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-06','Artwork 06','art-06.webp',5,1,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-07','Artwork 07','art-07.webp',6,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-08','Artwork 08','art-08.webp',7,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-09','Artwork 09','art-09.webp',8,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-10','Artwork 10','art-10.webp',9,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-11','Artwork 11','art-11.webp',10,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-12','Artwork 12','art-12.webp',11,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-13','Artwork 13','art-13.webp',12,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-14','Artwork 14','art-14.webp',13,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-15','Artwork 15','art-15.webp',14,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-16','Artwork 16','art-16.webp',15,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-17','Artwork 17','art-17.webp',16,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-18','Artwork 18','art-18.webp',17,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-19','Artwork 19','art-19.webp',18,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-20','Artwork 20','art-20.webp',19,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-21','Artwork 21','art-21.webp',20,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-22','Artwork 22','art-22.webp',21,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-23','Artwork 23','art-23.webp',22,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-24','Artwork 24','art-24.webp',23,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-25','Artwork 25','art-25.webp',24,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-26','Artwork 26','art-26.webp',25,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-27','Artwork 27','art-27.webp',26,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-28','Artwork 28','art-28.webp',27,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-29','Artwork 29','art-29.webp',28,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-30','Artwork 30','art-30.webp',29,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-31','Artwork 31','art-31.webp',30,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-32','Artwork 32','art-32.webp',31,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-33','Artwork 33','art-33.webp',32,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-34','Artwork 34','art-34.webp',33,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-35','Artwork 35','art-35.webp',34,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-36','Artwork 36','art-36.webp',35,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-37','Artwork 37','art-37.webp',36,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-38','Artwork 38','art-38.webp',37,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-39','Artwork 39','art-39.webp',38,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-40','Artwork 40','art-40.webp',39,0,0,1785352504,1785352504);
INSERT INTO art (id,name,image,"order",featured,hidden,created_at,updated_at) VALUES ('art-41','Artwork 41','art-41.webp',40,0,0,1785352504,1785352504);

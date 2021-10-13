ALTER TABLE users
ALTER COLUMN  password
SET DEFAULT '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u';

INSERT INTO users (name, email) 
VALUES ('SHZQGG','SHZQGG@gmai.com'),
('toumiao', 'toumiao@outlook.com'),
('jazzy', 'jazzy@hotmail.com');

INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,
parking_spaces, number_of_bathrooms, number_of_bedrooms,
country, street, city, province, post_code)
VALUES ('maple view', 'description', 'thumbnail_photo_url', 'cover_photo_url', 350, 2, 4, 2, 'Canada', 'Drummond', 'Montreal', 'Quebec', 'G37, 7V1'),
       ('connection-to-5-provinces', 'description', 'thumbnail_photo_url', 'cover_photo_url', 100, 1, 6, 2, 'China', 'Jiefang', 'Xuzhou', 'Jiangsu', '221000'),
       ('water village', 'description', 'thumbnail_photo_url', 'cover_photo_url', 200, 1, 2, 1, 'China', 'guanqian', 'Suzhou', 'Jiangsu', '223000');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2020-10-13', '2020-10-15', 1, 3),
       ('2020-10-10', '2020-10-14', 2, 1),
       ('2013-09-01', '2016-05-01', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES  (3, 1, 1, 7, 'message'),
        (1, 2, 2, 7, 'message'),
        (2, 3, 3, 10, 'message');



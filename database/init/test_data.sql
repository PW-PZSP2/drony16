INSERT INTO "user" (
    user_name,
    email,
    password,
    role,
    phone_number,
    is_blocked,
    creation_date,
    localisation,
    area,
    description
)
VALUES
-- ADMIN
('Admin', 'admin@test.pl', 'hashed_admin_pw', 'adm', '600100100', '0', '2024-10-01',
 NULL, NULL, NULL),

-- CLIENT 1
('Anna Nowak', 'anowak@test.pl', 'hashed_client_pw', 'cli', '600200200', '0', '2024-10-01',
 NULL, NULL, NULL),

-- CLIENT 2
('Jan Kowalski', 'jkowalski@test.pl', 'hashed_client_pw', 'cli', '600300300', '0', '2024-10-01',
 NULL, NULL, NULL),
-- OPERATOR (+ CLIENT)
('Jerzy Brzeziński', 'jbrzezinski@test.pl', 'hashed_operator_pw', 'ope', '600400400', '0', '2024-10-01',
 'Grójecka 122, 02-367 Warszawa', 50, 'Operator dronów z 5-letnim doświadczeniem.'),

-- OPERATOR (+ CLIENT)
('Janina Kowalska', 'jankakowalska@test.pl', 'hashed_operator_pw', 'ope', '600500500', '0', '2024-10-01',
 'Siedmiogrodzka 1, 01-204 Warszawa', 60, 'Doświadczona operatorka z ponad 100 zrealizowanymi zleceniami');


INSERT INTO attachment (
    name,
    description,
    file_path,
    operator_id
)
VALUES
('Projekt', 'Projekt działki', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 4),
('Zdjęcie realizacji', 'Zdjęcie zrealizowanego zlecenia', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 4),
('Portfolio1', 'Projekt w Łodzi', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 5),
('Portfolio2', 'Projekt w Warszawie', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 5);

INSERT INTO service (
    name
)
VALUES
('Ortofotomapa'),
('Chmura Punktów'),
('Numeryczne Modele Terenu'),
('Modele 3D'),
('Film'),
('Scanning Laserowy');

INSERT INTO service_parameter (
    name,
    unit,
    service_id
)
VALUES
('Rozdzielczość', 'cm/piksel', 1),
('Dokładność', 'cm', 1),
('Odbiornik RTK', 'bool', 1),
('Format', '"GeoTIFF", "JPEG", "PNG"', 1),
('Rozdzielczość', 'cm/piksel', 3),
('Dokładność', 'cm', 3),
('Odbiornik RTK', 'bool', 3),
('Format', '"GeoTIFF", "JPEG", "PNG"', 3),
('NMT', 'bool', 3),
('NMPT', 'bool', 3),
('Dokładność', 'cm', 2),
('Gęstość punktów', 'mln punktów/m²', 2),
('Kolorowa', 'bool', 2),
('Zklasyfikowana', 'bool', 2),
('Format', '"LAS", "LAZ", "E57"', 2),
('Dokładność', 'cm', 4),
('Ilość płaszczyzn', 'mln', 4),
('Format', '"OBJ", "FBX", "STEP"', 4),
('Czas trwania', 'minuty', 5),
('Jakość', '"4K", "Full HD"', 5),
('Stabilizacja', 'bool', 5),
('Format', '"MP4", "MOV", "INSV"', 5),
('Chmura punktów', 'bool', 6),
('Modele 3D', 'bool', 6),
('Numeryczne Modele Terenu', 'bool', 6);

INSERT INTO operator_service (
    service_id,
    operator_id
)
VALUES
(1, 4),
(2, 4),
(3, 4),
(5, 4),
(1, 5),
(4, 5),
(5, 5),
(6, 4);


INSERT INTO "order" (
    name,
    creation_date,
    description,
    raid_date,
    completion_date,
    deadline,
    location,
    operator_selection_date,
    service_id,
    score,
    opinion,
    state,
    client_id,
    operator_id
)
VALUES
('Scanning laserowy terenu budowy', '2024-11-30', 'Wykonanie skaningu laserowego terenu budowy pod przyszły kompleks mieszkaniowy.', '1', '0', '2024-12-15', 'Grójecka 122, 02-367 Warszawa', '2024-12-01', 6, 5, 'Super', 'Zrealizowane', 3, 4),
('Film promocyjny z eventu', '2024-12-05', 'Nagranie filmu promocyjnego działki.', '1', '0', '2024-12-30', 'Marszałkowska 99/101, 00-693 Warszawa', '2024-12-16', 5, NULL, NULL, 'Zrealizowane', 2, 4),
('Inwentaryzacja drzew na działce', '2025-01-02', 'Inwentaryzacja drzew na działce o powierzchni 2 ha w celu przygotowania dokumentacji projektowej.', '0', '1', '2025-03-01', 'Jazdów 12/7, 00-467 Warszawa', NULL, 1, NULL, NULL, 'Złożone', 2, NULL),
('Chmura punktów terenu', '2025-01-03', 'Wykonanie chmury punktów terenu pod planowaną budowę domu jednorodzinnego na działce 0.5 ha.', '1', '0', '2025-03-10', 'Budki Szczęśliwickie 59, 02-460 Warszawa', NULL, 2, NULL, NULL, 'Złożone', 3, NULL),
('Model 3D zabytkowego budynku', '2025-01-04', 'Stworzenie szczegółowego modelu 3D zabytkowego budynku w centrum miasta.', '0', '1', '2025-04-01', 'Złota 65, 00-800 Warszawa', '2025-01-05', 4, NULL, NULL, 'W trakcie', 4, 5);

INSERT INTO order_parameter (
    order_id,
    parameter_id,
    value
)
VALUES
(1, 23, 'true'),
(1, 24, 'false'),
(1, 25, 'false'),
(1, 11, '5'),
(1, 12, '1'),
(1, 13, 'true'),
(1, 14, 'true'),
(1, 15, 'LAZ'),
(2, 19, '10'),
(2, 20, '4K'),
(2, 21, 'true'),
(2, 22, 'MP4'),
(3, 1, '5'),
(3, 2, '10'),
(3, 3, 'true'),
(3, 4, 'GeoTIFF'),
(4, 11, '8'),
(4, 12, '2'),
(4, 13, 'false'),
(4, 14, 'true'),
(4, 15, 'LAS'),
(5, 16, '15'),
(5, 17, '3'),
(5, 18, 'OBJ');


INSERT INTO reported_operator (
    "date",
    order_id,
    operator_id
)
VALUES
('2024-12-01', 1, 4),
('2024-12-15', 2, 4),
('2025-01-05', 3, 4),
('2025-01-05', 3, 5),
('2025-01-05', 5, 5);

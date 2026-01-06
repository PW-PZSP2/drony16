INSERT INTO "user" (
    user_id,
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
(1, 'Admin', 'admin@test.pl', 'hashed_admin_pw', '100', '600100100', '0', '2024-10-01',
 NULL, NULL, NULL),

-- CLIENT 1
(2, 'Anna Nowak', 'anowak@test.pl', 'hashed_client_pw', '001', '600200200', '0', '2024-10-01',
 NULL, NULL, NULL),

-- CLIENT 2
(3, 'Jan Kowalski', 'jkowalski@test.pl', 'hashed_client_pw', '001', '600300300', '0', '2024-10-01',
 NULL, NULL, NULL),
-- OPERATOR (+ CLIENT)
(4, 'Jerzy Brzeziński', 'jbrzezinski@test.pl', 'hashed_operator_pw', '011', '600400400', '0', '2024-10-01',
 'Grójecka 122, 02-367 Warszawa', 50, 'Operator dronów z 5-letnim doświadczeniem.'),

-- OPERATOR (+ CLIENT)
(5, 'Janina Kowalska', 'jankakowalska@test.pl', 'hashed_operator_pw', '011', '600500500', '0', '2024-10-01',
 'Siedmiogrodzka 1, 01-204 Warszawa', 60, 'Doświadczona operatorka z ponad 100 zrealizowanymi zleceniami');


INSERT INTO attachment (
    attachment_id,
    name,
    description,
    file_path,
    operator_id
)
VALUES
(1, 'Projekt', 'Projekt działki', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 4),
(2, 'Zdjęcie realizacji', 'Zdjęcie zrealizowanego zlecenia', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 4),
(3, 'Portfolio1', 'Projekt w Łodzi', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 5),
(4, 'Portfolio2', 'Projekt w Warszawie', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 5);

INSERT INTO service (
    service_id,
    name
)
VALUES
(1, 'Ortofotomapa'),
(2, 'Chmura Punktów'),
(3, 'Numeryczne Modele Terenu'),
(4, 'Modele 3D'),
(5, 'Film'),
(6, 'Scanning Laserowy');

INSERT INTO service_parameter (
    parameter_id,
    name,
    unit,
    service_id
)
VALUES
(1, 'Rozdzielczość', 'cm/piksel', 1),
(2, 'Dokładność', 'cm', 1),
(3, 'Odbiornik RTK', 'bool', 1),
(4, 'Format', '"GeoTIFF", "JPEG", "PNG"', 1),
(5, 'Rozdzielczość', 'cm/piksel', 3),
(6, 'Dokładność', 'cm', 3),
(7, 'Odbiornik RTK', 'bool', 3),
(8, 'Format', '"GeoTIFF", "JPEG", "PNG"', 3),
(9, 'NMT', 'bool', 3),
(10, 'NMPT', 'bool', 3),
(11, 'Dokładność', 'cm', 2),
(12, 'Gęstość punktów', 'mln punktów/m²', 2),
(13, 'Kolorowa', 'bool', 2),
(14, 'Zklasyfikowana', 'bool', 2),
(15, 'Format', '"LAS", "LAZ", "E57"', 2),
(16, 'Dokładność', 'cm', 4),
(17, 'Ilość płaszczyzn', 'mln', 4),
(18, 'Format', '"OBJ", "FBX", "STEP"', 4),
(19, 'Czas trwania', 'minuty', 5),
(20, 'Jakość', '"4K", "Full HD"', 5),
(21, 'Stabilizacja', 'bool', 5),
(22, 'Format', '"MP4", "MOV", "INSV"', 5),
(23, 'Chmura punktów', 'bool', 6),
(24, 'Modele 3D', 'bool', 6),
(25, 'Numeryczne Modele Terenu', 'bool', 6);

INSERT INTO operator_service (
    entry_id,
    service_id,
    operator_id
)
VALUES
(1, 1, 4),
(2, 2, 4),
(3, 3, 4),
(4, 5, 4),
(5, 1, 5),
(6, 4, 5),
(7, 5, 5),
(8, 6, 4);


INSERT INTO "order" (
    order_id,
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
(1, 'Scanning laserowy terenu budowy', '2024-11-30', 'Wykonanie skaningu laserowego terenu budowy pod przyszły kompleks mieszkaniowy.', '1', '0', '2024-12-15', 'Grójecka 122, 02-367 Warszawa', '2024-12-01', 6, 5, 'Super', 'Zrealizowane', 3, 4),
(2, 'Film promocyjny z eventu', '2024-12-05', 'Nagranie filmu promocyjnego działki.', '1', '0', '2024-12-30', 'Marszałkowska 99/101, 00-693 Warszawa', '2024-12-16', 5, NULL, NULL, 'Zrealizowane', 2, 4),
(3, 'Inwentaryzacja drzew na działce', '2025-01-02', 'Inwentaryzacja drzew na działce o powierzchni 2 ha w celu przygotowania dokumentacji projektowej.', '0', '1', '2025-03-01', 'Jazdów 12/7, 00-467 Warszawa', NULL, 1, NULL, NULL, 'Złożone', 2, NULL),
(4, 'Chmura punktów terenu', '2025-01-03', 'Wykonanie chmury punktów terenu pod planowaną budowę domu jednorodzinnego na działce 0.5 ha.', '1', '0', '2025-03-10', 'Budki Szczęśliwickie 59, 02-460 Warszawa', NULL, 2, NULL, NULL, 'Złożone', 3, NULL),
(5, 'Model 3D zabytkowego budynku', '2025-01-04', 'Stworzenie szczegółowego modelu 3D zabytkowego budynku w centrum miasta.', '0', '1', '2025-04-01', 'Złota 65, 00-800 Warszawa', '2025-01-05', 4, NULL, NULL, 'W trakcie', 4, 5);

INSERT INTO order_parameter (
    entry_id,
    order_id,
    parameter_id,
    value
)
VALUES
(1, 1, 23, 'true'),
(2, 1, 24, 'false'),
(3, 1, 25, 'false'),
(4, 1, 11, '5'),
(5, 1, 12, '1'),
(6, 1, 13, 'true'),
(7, 1, 14, 'true'),
(8, 1, 15, 'LAZ'),
(9, 2, 19, '10'),
(10, 2, 20, '4K'),
(11, 2, 21, 'true'),
(12, 2, 22, 'MP4'),
(13, 3, 1, '5'),
(14, 3, 2, '10'),
(15, 3, 3, 'true'),
(16, 3, 4, 'GeoTIFF'),
(17, 4, 11, '8'),
(18, 4, 12, '2'),
(19, 4, 13, 'false'),
(20, 4, 14, 'true'),
(21, 4, 15, 'LAS'),
(22, 5, 16, '15'),
(23, 5, 17, '3'),
(24, 5, 18, 'OBJ');


INSERT INTO reported_operator (
    report_id,
    "date",
    order_id,
    operator_id
)
VALUES
(1, '2024-12-01', 1, 4),
(2, '2024-12-15', 2, 4),
(3, '2025-01-05', 3, 4),
(4, '2025-01-05', 3, 5),
(5, '2025-01-05', 5, 5);

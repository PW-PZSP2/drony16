INSERT INTO "user" (
    user_name,
    email,
    password,
    role,
    phone_number,
    is_blocked,
    creation_date,
    localisation,
    latitude,
    longitude,
    area,
    description
)
VALUES
-- ADMIN
('Admin', 'admin@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'adm', '600100100', '0', '2025-09-01',
 NULL, NULL, NULL, NULL, NULL),

-- CLIENT 1
('Anna Nowak', 'anowak@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'cli', '600200200', '0', '2025-09-05',
 NULL, NULL, NULL, NULL, NULL),

-- CLIENT 2
('Jan Kowalski', 'jkowalski@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'cli', '600300300', '0', '2025-09-10',
 NULL, NULL, NULL, NULL, NULL),

-- CLIENT 3
('Marek Wiśniewski', 'mwisniewski@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'cli', '600600600', '0', '2025-10-15',
 NULL, NULL, NULL, NULL, NULL),

-- CLIENT 4
('Katarzyna Dąbrowska', 'kdabrowska@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'cli', '600700700', '0', '2025-11-01',
 NULL, NULL, NULL, NULL, NULL),

-- OPERATOR 1
('Jerzy Brzeziński', 'jbrzezinski@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'ope', '600400400', '0', '2025-09-01',
 'Grójecka 122, 02-367 Warszawa, Polska', 52.2064, 20.9748, 200, 'Certyfikowany operator dronów z 5-letnim doświadczeniem. Specjalizuję się w skaningu laserowym i ortofotomapach. Posiadam licencję UAVO oraz najnowocześniejszy sprzęt w tym drony DJI Matrice 300 RTK i skaner laserowy Zenmuse L1. Obsługuję projekty budowlane, geodezyjne i infrastrukturalne.'),

-- OPERATOR 2
('Janina Kowalska', 'jankakowalska@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'ope', '600500500', '0', '2025-09-01',
 'Siedmiogrodzka 1, 01-204 Warszawa, Polska', 52.2465, 20.9831, 300, 'Doświadczona operatorka z ponad 100 zrealizowanymi zleceniami. Specjalizacja: fotogrametria, modele 3D i filmy promocyjne. Współpracuję z biurami architektonicznymi, deweloperami i agencjami marketingowymi. Posiadam certyfikat VLOS i BVLOS oraz drony DJI Phantom 4 RTK i Mavic 3 Cine.'),

-- OPERATOR 3
('Tomasz Lewandowski', 'tlewandowski@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'ope', '600800800', '0', '2025-09-15',
 'Polna 45, 05-120 Legionowo, Polska', 52.4050, 20.9450, 300, 'Pilot dronów z 7-letnim stażem. Realizuję kompleksowe projekty geodezyjne i mapowania terenu. Wyposażony w drony Autel EVO II Pro RTK oraz DJI Inspire 2. Obsługuję tereny do 100 ha. Specjalizuję się w ortofotomapach, NMT/NMPT oraz chmurach punktów dla branży budowlanej i rolniczej.'),

-- OPERATOR 4
('Magdalena Zielińska', 'mzielinska@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'ope', '600900900', '0', '2025-09-20',
 'Modlińska 234, 03-122 Warszawa, Polska', 52.2827, 20.9650, 300, 'Profesjonalna operatorka specjalizująca się w filmach reklamowych i eventowych. Ponad 150 zrealizowanych projektów dla firm z całej Polski. Drony: DJI Air 3, Mavic 3 Pro Cine, FPV. Oferuję pełną postprodukcję wideo, montaż i koloryzację. Pracuję z klientami z branży eventowej, nieruchomości i turystyki.'),

 -- ADMIN 2
('Admin 2', 'admin2@test.pl', '$2b$12$CvMDszzsF0SDogqyTcKE1ueglmmBLrYw9Lzd/dvVOwMVh6PDTRFXa', 'adm', '600100100', '0', '2026-01-10',
 NULL, NULL, NULL, NULL, NULL);


INSERT INTO attachment (
    name,
    description,
    file_path,
    operator_id
)
VALUES
-- Jerzy Brzeziński (operator_id=6)
('Ortofotomapa Inwestycji Grójecka', 'Kompleksowa ortofotomapa terenu inwestycyjnego o powierzchni 15 ha z rozdzielczością 2cm/px', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 6),
('Skaning Laserowy Budowy Biurowca', 'Dokumentacja laserowa placu budowy kompleksu biurowego - 5 kondygnacji', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 6),
('NMT Terenu Przemysłowego', 'Numeryczny Model Terenu działki 25 ha pod budowę magazynu logistycznego', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 6),
('Chmura Punktów - Modernizacja Drogi', 'Gęsta chmura punktów odcinka drogi 2.5km do projektu rozbudowy', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 6),

-- Janina Kowalska (operator_id=7)
('Model 3D Kościoła Św. Anny', 'Fotorealistyczny model 3D zabytkowego kościoła z dokładnością 1cm', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 7),
('Film Promocyjny Osiedla Parkowe', 'Materiał filmowy 4K dla dewelopera - wizualizacja osiedla i okolicy', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 7),
('Model 3D Willi w Konstancinie', 'Szczegółowy model rezydencji z ogrodem do celów projektowych', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 7),
('Portfolio Architektura', 'Zbiór zrealizowanych projektów dla biur architektonicznych - modele 3D i ortofotomapy', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 7),

-- Tomasz Lewandowski (operator_id=8)
('Ortofotomapa Pól Rolnych 80ha', 'Mapa ortofotograficzna gospodarstwa rolnego z analizą zdrowia roślin', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 8),
('NMT Terenu Kopalni', 'Numeryczne modele NMT i NMPT wyrobiska kopalni kruszyw - 45 ha', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 8),
('Chmura Punktów Linii Energetycznej', 'Klasyfikowana chmura punktów napowietrznej linii 110kV - 12km', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 8),
('Ortofotomapa Zalewu Zegrzyńskiego', 'Dokumentacja brzegu jeziora dla projektu rewitalizacji - 8km linii brzegowej', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 8),
('Portfolio Geodezja', 'Przykładowe projekty geodezyjne - pomiary, mapy, modele terenu', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 8),

-- Magdalena Zielińska (operator_id=9)
('Film Eventowy - Festiwal Muzyczny', 'Relacja z 3-dniowego festiwalu Opener - ujęcia z drona i montaż', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 9),
('Film Promocyjny Hotel SPA', 'Materiał reklamowy 4K dla hotelu - wnętrza, otoczenie, atrakcje', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 9),
('FPV Racing - Zakład Produkcyjny', 'Dynamiczny film FPV pokazujący proces produkcji w fabryce mebli', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 9),
('Film Inwestycja Deweloperska', 'Time-lapse budowy osiedla mieszkaniowego - 18 miesięcy w 3 minuty', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 9),
('Portfolio Wideo', 'Showreel - najlepsze realizacje filmowe z lat 2022-2025', 'https://docs.google.com/document/d/17AQedsQyYt0XVU6NF7EC0YkGkxf8sxcrY2dJytjfZVQ/edit?usp=sharing', 9);

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
-- Jerzy Brzeziński (operator_id=6) - Ortofotomapa, Chmura Punktów, NMT, Scanning Laserowy
(1, 6),
(2, 6),
(3, 6),
(6, 6),

-- Janina Kowalska (operator_id=7) - Ortofotomapa, Modele 3D, Film
(1, 7),
(4, 7),
(5, 7),

-- Tomasz Lewandowski (operator_id=8) - Ortofotomapa, Chmura Punktów, NMT
(1, 8),
(2, 8),
(3, 8),

-- Magdalena Zielińska (operator_id=9) - Film, Modele 3D
(5, 9),
(4, 9);


INSERT INTO "order" (
    name,
    creation_date,
    description,
    raid_date,
    completion_date,
    deadline,
    location,
    latitude,
    longitude,
    operator_selection_date,
    service_id,
    score,
    opinion,
    state,
    client_id,
    operator_id
)
VALUES
-- ZREALIZOWANE (Completed Orders) - Operator 6 (Jerzy)
('Ortofotomapa terenu budowy - Wilanów', '2025-12-01', 'Wykonanie ortofotomapy terenu budowy kompleksu mieszkaniowego o powierzchni 8 ha z rozdzielczością 2 cm/px.', '1', '1', '2025-12-20', 'Przyczółkowa 27A, 02-384 Warszawa, Polska', 52.1798, 21.0494, '2025-12-03', 1, 5, 'Świetna jakość mapy, terminowa realizacja. Operator bardzo profesjonalny i pomocny. Polecam!', 'Zakończone', 2, 6),

('Scanning laserowy budynku biurowego', '2025-12-05', 'Skaning laserowy 5-kondygnacyjnego budynku biurowego do dokumentacji powykonawczej.', '1', '1', '2025-12-22', 'Domaniewska 41, 02-672 Warszawa, Polska', 52.1896, 21.0408, '2025-12-07', 6, 5, 'Rewelacyjna precyzja, dane doskonale nadawały się do naszych analiz BIM. Na pewno będziemy współpracować dalej.', 'Zakończone', 3, 6),

('Ortofotomapa parku miejskiego', '2025-12-10', 'Mapa ortofotograficzna parku 12 ha do projektu rewitalizacji zieleni.', '1', '1', '2026-01-05', 'Park Skaryszewski, 03-810 Warszawa, Polska', 52.2497, 21.0694, '2025-12-12', 1, 5, 'Doskonała jakość, wszystko zgodnie z oczekiwaniami. Polecam!', 'Zakończone', 6, 6),
-- ZREALIZOWANE - Operator 7 (Janina)
('Model 3D zabytkowej kamienicy', '2025-12-02', 'Stworzenie fotorealistycznego modelu 3D kamienicy z przełomu XIX/XX wieku do celów konserwatorskich.', '1', '1', '2025-12-25', 'Nowy Świat 64, 00-357 Warszawa, Polska', 52.2319, 21.0212, '2025-12-04', 4, 5, 'Niesamowita dokładność! Model wykorzystaliśmy w projekcie renowacji. Pani Janina to prawdziwa profesjonalistka.', 'Zakończone', 5, 7),

('Model 3D willi - Konstancin', '2025-12-08', 'Szczegółowy model 3D rezydencji z ogrodem dla potrzeb projektu przebudowy.', '1', '1', '2026-01-08', 'Warszawska 124, 05-520 Konstancin-Jeziorna, Polska', 52.0851, 21.1175, '2025-12-10', 4, 5, 'Perfekcyjne odwzorowanie! Architekt był zachwycony jakością modelu. Będę polecać znajomym.', 'Zakończone', 2, 7),

('Film promocyjny deweloperski', '2025-12-12', 'Materiał wideo 4K przedstawiający inwestycję deweloperską i okolicę.', '1', '1', '2026-01-10', 'Mokotów, 02-777 Warszawa, Polska', 52.1865, 21.0417, '2025-12-14', 5, 4, 'Ładny film, dobrze oddaje charakter miejsca. Dziękuję!', 'Zakończone', 4, 7),

-- ZREALIZOWANE - Operator 8 (Tomasz)
('NMT terenu przemysłowego 20ha', '2025-12-03', 'Numeryczny Model Terenu działki pod budowę hali magazynowej o powierzchni 20 ha.', '1', '1', '2025-12-28', 'Marywilska 44, 03-228 Warszawa, Polska', 52.2892, 20.9664, '2025-12-05', 3, 5, 'Dane bardzo dokładne, szybka realizacja. Pan Tomasz zna się na rzeczy i można na nim polegać.', 'Zakończone', 6, 8),

('Ortofotomapa gospodarstwa rolnego', '2025-12-06', 'Mapa ortofotograficzna gospodarstwa 65 ha z analizą multispektralną dla potrzeb rolnictwa precyzyjnego.', '1', '1', '2026-01-03', 'Polna 156, 05-120 Legionowo, Polska', 52.4050, 20.9450, '2025-12-08', 1, 5, 'Dokładnie to czego potrzebowaliśmy. Analiza pomogła nam zoptymalizować nawożenie. Super!', 'Zakończone', 7, 8),

('Chmura punktów linii energetycznej', '2025-12-11', 'Wykonanie klasyfikowanej chmury punktów napowietrznej linii 110kV na odcinku 5 km.', '1', '1', '2026-01-07', '05-119 Legionowo, Polska', 52.4042, 20.9438, '2025-12-13', 2, 4, 'Dobra jakość danych, wszystko zgodnie z umową. Mieliśmy drobne opóźnienie, ale zostało to uzgodnione wcześniej.', 'Zakończone', 3, 8),

-- ZREALIZOWANE - Operator 9 (Magdalena)
('Film promocyjny osiedla Mokotów', '2025-12-04', 'Nagranie materiału promocyjnego nowej inwestycji deweloperskiej - osiedle + okolica.', '1', '1', '2025-12-30', 'Cybernetyki 7, 02-677 Warszawa, Polska', 52.2118, 21.0064, '2025-12-06', 5, 4, 'Film wyszedł ładnie, choć mogłoby być więcej ujęć z różnych perspektyw. Ogólnie jestem zadowolona.', 'Zakończone', 4, 9),

('Film eventowy - konferencja IT', '2025-12-09', 'Relacja filmowa z 2-dniowej konferencji technologicznej w centrum Warszawy.', '1', '1', '2026-01-06', 'Wybrzeże Kościuszkowskie 20, 00-390 Warszawa, Polska', 52.2401, 21.0309, '2025-12-11', 5, 5, 'Świetny montaż, profesjonalne ujęcia. Materiał wykorzystaliśmy w kampanii marketingowej. Dziękujemy!', 'Zakończone', 3, 9),

('Model 3D budynku szkoły', '2025-12-13', 'Fotorealistyczny model szkoły podstawowej do projektu termomodernizacji.', '1', '1', '2026-01-11', 'Batorego 15, 02-591 Warszawa, Polska', 52.2117, 21.0113, '2025-12-15', 4, 5, 'Doskonała jakość modelu, bardzo pomocne w projekcie. Bardzo polecam!', 'Zakończone', 5, 9),

-- ZREALIZOWANE BEZ OCENY (Completed but not rated yet)
('Chmura punktów terenu budowy', '2025-12-16', 'Gęsta chmura punktów placu budowy 3 ha - dokumentacja miesięczna postępu prac.', '1', '1', '2026-01-13', 'Wilanowska 255, 02-665 Warszawa, Polska', 52.1743, 21.0429, '2025-12-18', 2, NULL, NULL, 'Zakończone', 2, 8),

('Film reklamowy restauracji', '2025-12-17', 'Krótki spot reklamowy restauracji - wnętrze, dania, atmosfera. Do kampanii w social media.', '1', '1', '2026-01-14', 'Plac Zbawiciela 3, 00-582 Warszawa, Polska', 52.2217, 21.0254, '2025-12-19', 5, NULL, NULL, 'Zakończone', 7, 9),

('NMT działki pod farmę fotowoltaiczną', '2025-12-18', 'Numeryczny Model Terenu działki 35 ha pod budowę farmy solarnej.', '1', '1', '2026-01-15', '96-320 Mszczonów, Polska', 51.9769, 20.5174, '2025-12-20', 3, NULL, NULL, 'Zakończone', 4, 8),

('Ortofotomapa zabytkowego parku', '2025-12-20', 'Wysokorozdzielcza mapa parku dworskiego 8 ha do projektu konserwatorskiego.', '1', '1', '2026-01-16', '02-958 Wilanów, Warszawa, Polska', 52.1654, 21.0894, '2025-12-22', 1, NULL, NULL, 'Zakończone', 5, 6),

('Film promocyjny centrum handlowego', '2025-12-19', 'Materiał wideo 4K przedstawiający centrum handlowe i jego otoczenie.', '1', '1', '2026-01-17', 'Wołoska 12, 02-675 Warszawa, Polska', 52.1918, 20.9928, '2025-12-21', 5, NULL, NULL, 'Zakończone', 6, 7),

-- W TRAKCIE (In Progress Orders) - Operator 6 (Jerzy)
('Scanning laserowy mostu', '2026-01-08', 'Dokumentacja laserowa mostu drogowego przed planowanym remontem - 250m długości.', '1', '0', '2026-02-15', 'Most Gdański, 01-308 Warszawa, Polska', 52.2601, 20.9862, '2026-01-10', 6, NULL, NULL, 'W trakcie', 2, 6),

('Chmura punktów placu budowy', '2026-01-09', 'Dokumentacja chmury punktów dużego placu budowy 5 ha.', '1', '0', '2026-02-20', '02-958 Wilanów, Warszawa, Polska', 52.1654, 21.0894, '2026-01-11', 2, NULL, NULL, 'W trakcie', 3, 6),

('Ortofotomapa terenu inwestycyjnego', '2026-01-12', 'Wysokorozdzielcza ortofotomapa terenu pod budowę 10 ha.', '1', '0', '2026-02-25', '05-520 Konstancin-Jeziorna, Polska', 52.0851, 21.1175, '2026-01-14', 1, NULL, NULL, 'W trakcie', 5, 6),

-- W TRAKCIE - Operator 7 (Janina)
('Film promocyjny hotelu SPA', '2026-01-10', 'Materiał promocyjny 4K dla hotelu - wnętrza, basen, otoczenie, atrakcje lokalne.', '1', '0', '2026-02-20', 'Parkowa 22, 05-520 Konstancin-Jeziorna, Polska', 52.0841, 21.1165, '2026-01-12', 5, NULL, NULL, 'W trakcie', 7, 7),

('Model 3D kościoła - dokumentacja', '2026-01-11', 'Fotorealistyczny model 3D zabytkowego kościoła dla konserwatora zabytków.', '1', '0', '2026-03-01', 'Plac Zamkowy 4, 00-277 Warszawa, Polska', 52.2477, 21.0142, '2026-01-13', 4, NULL, NULL, 'W trakcie', 2, 7),

('Model 3D muzeum', '2026-01-13', 'Model 3D budynku muzeum dla celów dokumentacyjnych i prezentacyjnych.', '1', '0', '2026-03-05', 'Krakowskie Przedmieście, 00-068 Warszawa, Polska', 52.2403, 21.0163, '2026-01-15', 4, NULL, NULL, 'W trakcie', 6, 7),
-- W TRAKCIE - Operator 8 (Tomasz)
('Chmura punktów kamieniołomu', '2026-01-09', 'Gęsta chmura punktów wyrobiska - 30 ha do inwentaryzacji zasobów.', '1', '0', '2026-02-28', '26-110 Skarżysko-Kamienna, Polska', 51.1105, 20.8829, '2026-01-11', 2, NULL, NULL, 'W trakcie', 3, 8),

('NMT terenu pod autostradę', '2026-01-12', 'Numeryczny Model Terenu pasa gruntów 8 km x 100 m pod budowę obwodnicy.', '1', '0', '2026-03-15', '05-119 Legionowo, Polska', 52.4042, 20.9438, '2026-01-14', 3, NULL, NULL, 'W trakcie', 7, 8),

('Ortofotomapa lasu miejskiego', '2026-01-14', 'Mapa ortofotograficzna lasu 25 ha do planu zagospodarowania.', '1', '0', '2026-03-10', 'Las Bielański, 01-466 Warszawa, Polska', 52.2742, 20.9413, '2026-01-16', 1, NULL, NULL, 'W trakcie', 4, 8),

-- W TRAKCIE - Operator 9 (Magdalena)
('Film promocyjny fitness club', '2026-01-10', 'Materiał promocyjny 4K - wnętrza, treningi, atmosfera klubu.', '1', '0', '2026-02-15', '02-777 Mokotów, Warszawa, Polska', 52.1865, 21.0417, '2026-01-12', 5, NULL, NULL, 'W trakcie', 5, 9),

('Film eventowy - ślub', '2026-01-13', 'Relacja filmowa z przyjęcia weselnego - ujęcia z drona i tradycyjne.', '1', '0', '2026-02-18', '05-520 Konstancin-Jeziorna, Polska', 52.0851, 21.1175, '2026-01-15', 5, NULL, NULL, 'W trakcie', 2, 9),

('Model 3D kawiarni', '2026-01-15', 'Model 3D wnętrza i otoczenia kawiarni do celów marketingowych.', '1', '0', '2026-02-25', '00-002 Śródmieście, Warszawa, Polska', 52.2297, 21.0122, '2026-01-17', 4, NULL, NULL, 'W trakcie', 6, 9),

-- ZŁOŻONE (Submitted Orders - waiting for operator selection)
('Ortofotomapa działki budowlanej', '2026-01-15', 'Mapa ortofotograficzna działki 2.5 ha pod budowę domu jednorodzinnego z rozdzielczością 3 cm/px.', '0', '0', '2026-03-01', 'Wiśniowa 45, 05-075 Wesoła, Warszawa, Polska', 52.2517, 21.1945, NULL, 1, NULL, NULL, 'Złożone', 2, NULL),

('Film z lotu ptaka - nieruchomość', '2026-01-16', 'Krótki film prezentujący posiadłość na sprzedaż - dom + działka 1 ha.', '0', '0', '2026-02-28', 'Sadowa 12, 05-520 Konstancin-Jeziorna, Polska', 52.0841, 21.1165, NULL, 5, NULL, NULL, 'Złożone', 4, NULL),

('Model 3D fabryki - BIM', '2026-01-16', 'Model 3D budynku produkcyjnego do dokumentacji BIM i projektu rozbudowy.', '0', '0', '2026-04-01', 'Instalatorów 5, 02-237 Warszawa, Polska', 52.2073, 20.9622, NULL, 4, NULL, NULL, 'Złożone', 3, NULL),

('Chmura punktów terenu leśnego', '2026-01-17', 'Klasyfikowana chmura punktów terenu leśnego 15 ha - inwentaryzacja drzewostanu.', '0', '0', '2026-03-30', 'Las Kabacki, 02-798 Warszawa, Polska', 52.1322, 21.0525, NULL, 2, NULL, NULL, 'Złożone', 5, NULL),

('NMT terenu kopalni piasku', '2026-01-17', 'Modele NMT i NMPT wyrobiska piaskowego 40 ha - monitoring eksploatacji.', '0', '0', '2026-04-15', '05-430 Celestynów, Polska', 52.0567, 21.3072, NULL, 3, NULL, NULL, 'Złożone', 6, NULL),

('Scanning laserowy hali magazynowej', '2026-01-18', 'Skaning laserowy wnętrza hali 5000 m2 do dokumentacji powykonawczej i projektu regałów.', '0', '0', '2026-03-10', 'Magazynowa 88, 05-090 Raszyn, Polska', 52.1035, 20.9152, NULL, 6, NULL, NULL, 'Złożone', 7, NULL),

('Ortofotomapa centrum miasta', '2026-01-18', 'Wysokorozdzielcza ortofotomapa centrum 50 ha - 1.5 cm/px dla celów urbanistycznych.', '0', '0', '2026-04-30', '05-119 Legionowo, Polska', 52.4042, 20.9438, NULL, 1, NULL, NULL, 'Złożone', 2, NULL),

('Film promocyjny zakładu produkcyjnego', '2026-01-18', 'Materiał promocyjny pokazujący proces produkcji i nowoczesne technologie - FPV + klasyczne ujęcia.', '0', '0', '2026-03-20', 'Produkcyjna 15, 05-200 Wołomin, Polska', 52.3402, 21.2423, NULL, 5, NULL, NULL, 'Złożone', 4, NULL),

('Chmura punktów mostu kolejowego', '2026-01-18', 'Dokumentacja laserowa starego mostu kolejowego przed remontem.', '0', '0', '2026-03-25', 'Most Średniecowy, 00-001 Warszawa, Polska', 52.2321, 21.0044, NULL, 2, NULL, NULL, 'Złożone', 3, NULL),

('Ortofotomapa osiedla', '2026-01-18', 'Ortofotomapa osiedla mieszkaniowego 12 ha - aktualizacja dokumentacji.', '0', '0', '2026-03-15', '02-777 Ursynów, Warszawa, Polska', 52.1437, 21.0486, NULL, 1, NULL, NULL, 'Złożone', 5, NULL),

('Model 3D willi luksusowej', '2026-01-18', 'Szczegółowy model 3D rezydencji z basenem i ogrodem.', '0', '0', '2026-04-10', '02-958 Wilanów, Warszawa, Polska', 52.1654, 21.0894, NULL, 4, NULL, NULL, 'Złożone', 7, NULL),

('NMT terenu przemysłowego', '2026-01-18', 'Numeryczny model terenu działki przemysłowej 18 ha.', '0', '0', '2026-04-05', '05-800 Pruszków, Polska', 52.1618, 20.8129, NULL, 3, NULL, NULL, 'Złożone', 6, NULL);

INSERT INTO order_parameter (
    order_id,
    parameter_id,
    value
)
VALUES
-- Order 1: Ortofotomapa terenu budowy - Wilanów
(1, 1, '2'),
(1, 2, '5'),
(1, 3, 'true'),
(1, 4, 'GeoTIFF'),

-- Order 2: Scanning laserowy budynku biurowego
(2, 23, 'true'),
(2, 24, 'true'),
(2, 25, 'true'),
-- Parametry dla Chmury Punktów (bo 23=true)
(2, 11, '2'),
(2, 12, '5'),
(2, 13, 'true'),
(2, 14, 'true'),
(2, 15, 'LAZ'),
-- Parametry dla Modeli 3D (bo 24=true)
(2, 16, '2'),
(2, 17, '10'),
(2, 18, 'OBJ'),
-- Parametry dla NMT (bo 25=true)
(2, 5, '2'),
(2, 6, '5'),
(2, 7, 'true'),
(2, 8, 'GeoTIFF'),
(2, 9, 'true'),
(2, 10, 'true'),

-- Order 3: Ortofotomapa parku miejskiego
(3, 1, '3'),
(3, 2, '10'),
(3, 3, 'false'),
(3, 4, 'GeoTIFF'),

-- Order 4: Model 3D zabytkowej kamienicy
(4, 16, '1'),
(4, 17, '5'),
(4, 18, 'OBJ'),

-- Order 5: Model 3D willi - Konstancin
(5, 16, '2'),
(5, 17, '8'),
(5, 18, 'FBX'),

-- Order 6: Film promocyjny deweloperski
(6, 19, '12'),
(6, 20, '4K'),
(6, 21, 'true'),
(6, 22, 'MP4'),

-- Order 7: NMT terenu przemysłowego 20ha
(7, 5, '3'),
(7, 6, '5'),
(7, 7, 'true'),
(7, 8, 'GeoTIFF'),
(7, 9, 'true'),
(7, 10, 'true'),

-- Order 8: Ortofotomapa gospodarstwa rolnego
(8, 1, '5'),
(8, 2, '8'),
(8, 3, 'true'),
(8, 4, 'GeoTIFF'),

-- Order 9: Chmura punktów linii energetycznej
(9, 11, '5'),
(9, 12, '2'),
(9, 13, 'true'),
(9, 14, 'true'),
(9, 15, 'LAZ'),

-- Order 10: Film promocyjny osiedla Mokotów
(10, 19, '15'),
(10, 20, '4K'),
(10, 21, 'true'),
(10, 22, 'MP4'),

-- Order 11: Film eventowy - konferencja IT
(11, 19, '20'),
(11, 20, '4K'),
(11, 21, 'true'),
(11, 22, 'MP4'),

-- Order 12: Model 3D budynku szkoły
(12, 16, '3'),
(12, 17, '7'),
(12, 18, 'OBJ'),

-- Order 13: Chmura punktów terenu budowy
(13, 11, '8'),
(13, 12, '3'),
(13, 13, 'true'),
(13, 14, 'true'),
(13, 15, 'LAZ'),

-- Order 14: Film reklamowy restauracji
(14, 19, '3'),
(14, 20, '4K'),
(14, 21, 'true'),
(14, 22, 'MP4'),

-- Order 15: NMT działki pod farmę fotowoltaiczną
(15, 5, '5'),
(15, 6, '10'),
(15, 7, 'false'),
(15, 8, 'GeoTIFF'),
(15, 9, 'true'),
(15, 10, 'true'),

-- Order 16: Ortofotomapa zabytkowego parku
(16, 1, '2'),
(16, 2, '5'),
(16, 3, 'true'),
(16, 4, 'GeoTIFF'),

-- Order 17: Film promocyjny centrum handlowego
(17, 19, '8'),
(17, 20, '4K'),
(17, 21, 'true'),
(17, 22, 'MP4'),

-- Order 18: Scanning laserowy mostu (W trakcie)
(15, 23, 'true'),
(15, 24, 'false'),
(15, 25, 'true'),
-- Parametry dla Chmury Punktów (bo 23=true)
(15, 11, '3'),
(15, 12, '8'),
(15, 13, 'true'),
(15, 14, 'true'),
(15, 15, 'LAZ'),

-- Order 18: Scanning laserowy mostu (W trakcie)
(18, 23, 'true'),
(18, 24, 'false'),
(18, 25, 'true'),
-- Parametry dla Chmury Punktów (bo 23=true)
(18, 11, '3'),
(18, 12, '8'),
(18, 13, 'true'),
(18, 14, 'true'),
(18, 15, 'LAZ'),
-- Parametry dla NMT (bo 25=true)
(18, 5, '3'),
(18, 6, '8'),
(18, 7, 'true'),
(18, 8, 'GeoTIFF'),
(18, 9, 'true'),
(18, 10, 'true'),

-- Order 19: Chmura punktów placu budowy
(19, 11, '5'),
(19, 12, '4'),
(19, 13, 'true'),
(19, 14, 'true'),
(19, 15, 'LAZ'),

-- Order 20: Ortofotomapa terenu inwestycyjnego
(20, 1, '2'),
(20, 2, '5'),
(20, 3, 'true'),
(20, 4, 'GeoTIFF'),

-- Order 21: Film promocyjny hotelu SPA
(21, 19, '20'),
(21, 20, '4K'),
(21, 21, 'true'),
(21, 22, 'MP4'),

-- Order 22: Model 3D kościoła
(22, 16, '1'),
(22, 17, '10'),
(22, 18, 'OBJ'),

-- Order 23: Model 3D muzeum
(23, 16, '2'),
(23, 17, '12'),
(23, 18, 'FBX'),

-- Order 24: Chmura punktów kamieniołomu
(24, 11, '10'),
(24, 12, '3'),
(24, 13, 'false'),
(24, 14, 'true'),
(24, 15, 'LAS'),

-- Order 25: NMT terenu pod autostradę
(25, 5, '5'),
(25, 6, '10'),
(25, 7, 'true'),
(25, 8, 'GeoTIFF'),
(25, 9, 'true'),
(25, 10, 'true'),

-- Order 26: Ortofotomapa lasu miejskiego
(26, 1, '4'),
(26, 2, '10'),
(26, 3, 'false'),
(26, 4, 'GeoTIFF'),

-- Order 27: Film promocyjny fitness club
(27, 19, '10'),
(27, 20, '4K'),
(27, 21, 'true'),
(27, 22, 'MP4'),

-- Order 28: Film eventowy - ślub
(28, 19, '15'),
(28, 20, '4K'),
(28, 21, 'true'),
(28, 22, 'MP4'),

-- Order 29: Model 3D kawiarni
(29, 16, '3'),
(29, 17, '8'),
(29, 18, 'OBJ'),

-- Order 30: Ortofotomapa działki budowlanej (Złożone)
(30, 1, '3'),
(30, 2, '10'),
(30, 3, 'false'),
(30, 4, 'GeoTIFF'),

-- Order 31: Film z lotu ptaka - nieruchomość (Złożone)
(31, 19, '5'),
(31, 20, '4K'),
(31, 21, 'true'),
(31, 22, 'MP4'),

-- Order 32: Model 3D fabryki - BIM (Złożone)
(32, 16, '5'),
(32, 17, '15'),
(32, 18, 'STEP'),

-- Order 33: Chmura punktów terenu leśnego (Złożone)
(33, 11, '10'),
(33, 12, '5'),
(33, 13, 'true'),
(33, 14, 'true'),
(33, 15, 'LAZ'),

-- Order 34: NMT terenu kopalni piasku (Złożone)
(34, 5, '10'),
(34, 6, '15'),
(34, 7, 'false'),
(34, 8, 'GeoTIFF'),
(34, 9, 'true'),
(34, 10, 'true'),

-- Order 35: Scanning laserowy hali magazynowej (Złożone)
(35, 23, 'true'),
(35, 24, 'true'),
(35, 25, 'false'),
-- Parametry dla Chmury Punktów (bo 23=true)
(35, 11, '5'),
(35, 12, '10'),
(35, 13, 'false'),
(35, 14, 'true'),
(35, 15, 'E57'),
-- Parametry dla Modeli 3D (bo 24=true)
(35, 16, '5'),
(35, 17, '20'),
(35, 18, 'OBJ'),

-- Order 36: Ortofotomapa centrum miasta (Złożone)
(36, 1, '1.5'),
(36, 2, '3'),
(36, 3, 'true'),
(36, 4, 'GeoTIFF'),

-- Order 37: Film promocyjny zakładu produkcyjnego (Złożone)
(37, 19, '10'),
(37, 20, '4K'),
(37, 21, 'true'),
(37, 22, 'MP4'),

-- Order 38: Chmura punktów mostu kolejowego (Złożone)
(38, 11, '6'),
(38, 12, '4'),
(38, 13, 'true'),
(38, 14, 'true'),
(38, 15, 'LAZ'),

-- Order 39: Ortofotomapa osiedla (Złożone)
(39, 1, '2.5'),
(39, 2, '7'),
(39, 3, 'true'),
(39, 4, 'GeoTIFF'),

-- Order 40: Model 3D willi luksusowej (Złożone)
(40, 16, '1.5'),
(40, 17, '15'),
(40, 18, 'OBJ'),

-- Order 41: NMT terenu przemysłowego (Złożone)
(41, 5, '4'),
(41, 6, '8'),
(41, 7, 'true'),
(41, 8, 'GeoTIFF'),
(41, 9, 'true'),
(41, 10, 'true');


INSERT INTO reported_operator (
    "date",
    order_id,
    operator_id
)
VALUES
-- Completed orders - reported operators (Grudzień 2025)
('2025-12-02', 1, 6),
('2025-12-02', 1, 8),
('2025-12-06', 2, 6),
('2025-12-06', 2, 8),
('2025-12-11', 3, 6),
('2025-12-11', 3, 8),
('2025-12-03', 4, 7),
('2025-12-03', 4, 6),
('2025-12-09', 5, 7),
('2025-12-09', 5, 8),
('2025-12-13', 6, 7),
('2025-12-13', 6, 9),
('2025-12-04', 7, 8),
('2025-12-04', 7, 6),
('2025-12-07', 8, 8),
('2025-12-07', 8, 6),
('2025-12-12', 9, 8),
('2025-12-12', 9, 6),
('2025-12-05', 10, 9),
('2025-12-05', 10, 7),
('2025-12-10', 11, 9),
('2025-12-10', 11, 7),
('2025-12-14', 12, 9),
('2025-12-14', 12, 7),

-- Completed without rating - reported operators
('2025-12-17', 13, 8),
('2025-12-17', 13, 6),
('2025-12-18', 14, 9),
('2025-12-18', 14, 7),
('2025-12-19', 15, 8),
('2025-12-19', 15, 6),
('2025-12-21', 16, 6),
('2025-12-21', 16, 8),
('2025-12-20', 17, 7),
('2025-12-20', 17, 9),

-- In progress orders - reported operators (Styczeń 2026)
('2026-01-09', 18, 6),
('2026-01-09', 18, 8),
('2026-01-10', 19, 6),
('2026-01-10', 19, 8),
('2026-01-13', 20, 6),
('2026-01-13', 20, 8),
('2026-01-11', 21, 7),
('2026-01-11', 21, 9),
('2026-01-12', 22, 7),
('2026-01-12', 22, 6),
('2026-01-14', 23, 7),
('2026-01-14', 23, 9),
('2026-01-10', 24, 8),
('2026-01-10', 24, 6),
('2026-01-13', 25, 8),
('2026-01-13', 25, 6),
('2026-01-15', 26, 8),
('2026-01-15', 26, 6),
('2026-01-11', 27, 9),
('2026-01-11', 27, 7),
('2026-01-14', 28, 9),
('2026-01-14', 28, 7),
('2026-01-16', 29, 9),
('2026-01-16', 29, 7),

-- Submitted orders - reported operators (waiting for client selection)
('2026-01-16', 30, 6),
('2026-01-16', 30, 8),
('2026-01-17', 31, 9),
('2026-01-17', 31, 7),
('2026-01-17', 32, 7),
('2026-01-17', 32, 6),
('2026-01-18', 33, 8),
('2026-01-18', 33, 6),
('2026-01-18', 34, 8),
('2026-01-18', 34, 6),
('2026-01-18', 35, 6),
('2026-01-18', 35, 8),
('2026-01-18', 36, 6),
('2026-01-18', 36, 8),
('2026-01-18', 37, 9),
('2026-01-18', 37, 7),
('2026-01-18', 38, 8),
('2026-01-18', 38, 6),
('2026-01-18', 39, 6),
('2026-01-18', 39, 8),
('2026-01-18', 40, 7),
('2026-01-18', 40, 9),
('2026-01-18', 41, 8),
('2026-01-18', 41, 6);


INSERT INTO homepage_content (id, content, updated_by)
VALUES (1, '{
  "hero": {
    "title": "Połącz się z profesjonalnymi operatorami dronów",
    "subtitle": "Platforma łącząca zleceniodawców potrzebujących usług dronowych z doświadczonymi operatorami. Ortofotomapy, modele 3D, filmy i wiele więcej.",
    "cta_primary": {
      "text": "Znajdź Operatora",
      "link": "/login?action=register&role=client"
    },
    "cta_secondary": {
      "text": "Zostań Operatorem",
      "link": "/login?action=register&role=operator"
    },
    "background_image": "../public/images/home_page1.jpg",
    "hero_image": "../public/images/home_page2.jpg"
  },
  "services": {
    "title": "Dostępne Usługi",
    "subtitle": "Szeroka gama profesjonalnych usług dronowych wykonywanych przez certyfikowanych operatorów",
    "items": [
      {
        "icon": "map",
        "title": "Ortofotomapa",
        "description": "Wysokiej jakości mapy ortofotograficzne z precyzyjnym pozycjonowaniem i szczegółowością GSD",
        "color": "blue"
      },
      {
        "icon": "mountain",
        "title": "Numeryczne Modele Terenu",
        "description": "Tworzenie dokładnych modeli wysokościowych terenu (NMPT, NMT) z wykorzystaniem najnowszych technologii",
        "color": "green"
      },
      {
        "icon": "box",
        "title": "Chmura Punktów",
        "description": "Generowanie gęstych chmur punktów z możliwością klasyfikacji i kolorowania",
        "color": "gray"
      },
      {
        "icon": "cuboid",
        "title": "Modele 3D",
        "description": "Fotorealistyczne modele 3D obiektów i terenów z wysoką dokładnością geometryczną",
        "color": "blue"
      },
      {
        "icon": "scan-line",
        "title": "Scanning Laserowy",
        "description": "Precyzyjne pomiary laserowe z generowaniem chmur punktów i modeli 3D",
        "color": "green"
      },
      {
        "icon": "camera",
        "title": "Filmy",
        "description": "Profesjonalne filmy przestrzeni, infrastruktury i budynków",
        "color": "gray"
      }
    ]
  },
  "how_it_works": {
    "title": "Jak to działa?",
    "subtitle": "Prosty proces od zlecenia do realizacji",
    "steps": [
      {
        "number": 1,
        "title": "Utwórz Zlecenie",
        "description": "Opisz swoje potrzeby, wybierz usługę i parametry, wskaż lokalizację i termin",
        "color": "blue"
      },
      {
        "number": 2,
        "title": "Wybierz Operatora",
        "description": "Operatorzy z Twojej okolicy zgłoszą się do zlecenia. Sprawdź ich profile i wybierz najlepszego",
        "color": "green"
      },
      {
        "number": 3,
        "title": "Odbierz Wyniki",
        "description": "Operator wykona usługę i dostarczy wyniki zgodnie z Twoimi wymaganiami",
        "color": "gray"
      }
    ]
  },
  "cta_section": {
    "title": "Gotowy na start?",
    "subtitle": "Dołącz do naszej platformy już dziś i skorzystaj z profesjonalnych usług dronowych",
    "cta_primary": {
      "text": "Utwórz Zlecenie",
      "link": "/login?action=register&role=client"
    },
    "cta_secondary": {
      "text": "Zostań Operatorem",
      "link": "/login?action=register&role=operator"
    }
  },
  "footer": {
    "logo": {
      "description": "Platforma łącząca zleceniodawców z profesjonalnymi operatorami dronów"
    },
    "contact": {
      "email": "kontakt@droneplatform.pl",
      "phone": "+48 600 123 456",
      "address": "Warszawa, Polska"
    },
    "copyright": "© 2026 Droneo. Wszystkie prawa zastrzeżone."
  }
}', 1);


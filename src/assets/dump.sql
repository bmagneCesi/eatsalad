PRAGMA foreign_keys=off;

CREATE TABLE IF NOT EXISTS `ville` ( 
	`id_ville` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	`postcode` TEXT NOT NULL,
	`name` TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS `restaurant` ( 
	`id_restaurant` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	`name` TEXT NOT NULL, 
	`address` TEXT NOT NULL, 
	`emails` TEXT,
	`ville_id` INTEGER,
	FOREIGN KEY(`ville_id`) REFERENCES `ville`(`id_ville`)
);

CREATE TABLE IF NOT EXISTS `question_category` ( 
	`id_question_category` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	`name` TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS `question_subcategory` ( 
	`id_question_subcategory` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	`name` TEXT NOT NULL, 
	`question_category_id` INTEGER, 
	FOREIGN KEY(`question_category_id`) REFERENCES `question_category`(`id_question_category`)
);

CREATE TABLE IF NOT EXISTS `question` ( 
	`id_question` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	`question` TEXT, 
	`question_subcategory_id` INTEGER
);

CREATE TABLE IF NOT EXISTS `response` ( 
	`id_response` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	`response` INTEGER , `score` INTEGER
);

CREATE TABLE IF NOT EXISTS `evaluation` ( 
	`id_evaluation` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	`date` TEXT NOT NULL, 
	`comment` TEXT NOT NULL, 
	`controller_name` TEXT, 
	`controller_signature` TEXT, 
	`franchised_signature` TEXT, 
	`restaurant_id` INTEGER NOT NULL,
	FOREIGN KEY(`restaurant_id`) REFERENCES `restaurant`(`id_restaurant`) 
);

CREATE TABLE `question_has_response` (
	`id_question_has_response`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`comment`	TEXT,
	`response_id`	INTEGER,
	`question_id`	INTEGER,
	`evaluation_id`	INTEGER,
	FOREIGN KEY(`evaluation_id`) REFERENCES `evaluation`(`id_evaluation`) ON DELETE CASCADE,
	FOREIGN KEY(`response_id`) REFERENCES `question_subcategory` ON DELETE CASCADE,
	FOREIGN KEY(`question_id`) REFERENCES `question`(`id_question`) ON DELETE CASCADE
);

CREATE TABLE `question_has_response_image` (
	`id_question_has_response_image` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`path`	TEXT NOT NULL,
	`question_has_response_id`	INTEGER NOT NULL,
	FOREIGN KEY(`question_has_response_id`) REFERENCES `question_has_response`(`id_question_has_response`) ON DELETE CASCADE
);

INSERT OR IGNORE INTO `response` VALUES (1,"CONFORME",3), (2,"SATISFAIT / À AMÉLIORER",2), (3,"PEU SATISFAIT",1), (4,"TRÈS PEU SATISFAIT",0);
INSERT OR IGNORE INTO `question_subcategory` VALUES (1,"Extérieur",1), (2,"Salle",1), (3,"Espace sanitaire",1), (4,"Sécurité",1), (5,"Cuisine",2), (6,"Chambre Froide",2), (7,"Gestion produits",2), (8,"Accueil clientèle",3), (9,"Départ clientèle",3), (10,"Prise de commande et encaissement",3), (11,"Emporter",3), (12,"Gestion produits",3);
INSERT OR IGNORE INTO `question_category` VALUES (1,"RESTAURANT"), (2,"CUISINE"), (3,"SERVICE CLIENT");
INSERT OR IGNORE INTO `question` VALUES (1, "Propreté de la terrasse",1),
(2, "Propreté de la vitrine/façade",1),
(3, "Panneau extérieur : Présence",1),
(4, "Panneau extérieur : Propreté",1),
(5, "Propreté et état général : Peinture",2),
(6, "Propreté et état général : Sol",2),
(7, "Propreté et état général : Mur",2),
(8, "Températures",2),
(9, "Manuel de service à jour (délai 48h mise en place)",2),
(10, "Ambiance lumineuse",2),
(11, "Ampoules : En fonction",2),
(12, "Ampoules : Propreté",2),
(13, "Propreté : Tables",2),
(14, "Propreté : Pieds de table",2),
(15, "Propreté : Chaises",2),
(16, "Assiettes (propres et en bon état)",2),
(17, "Pinces (propres et en bon état)",2),
(18, "Tables inoccupées : Débarassage",2),
(19, "Tables inoccupées : Nettoyage",2),
(20, "Musique de fond : Volume",2),
(21, "Musique de fond : Pertinence",2),
(22, "État",3),
(23, "Propreté",3),
(24, "Odeur",3),
(25, "Présence et propreté : Savon",3),
(26, "Présence et propreté : Papier toilette",3),
(27, "Présence et propreté : Brosse",3),
(28, "Présence et propreté : Sèche-main",3),
(29, "Extincteurs",4),
(30, "Propreté : Planches",5),
(31, "Propreté : Bacs à salade",5),
(32, "Propreté : Robot-coupe",5),
(33, "Propreté : Presse-citron",5),
(34, "Propreté : Plan de travail haut et bas",5),
(35, "Propreté : Siphons",5),
(36, "Propreté : Robinetterie",5),
(37, "Propreté : Réserve",5),
(38, "Propreté : Murs",5),
(39, "Propreté : Sol",5),
(40, "Propreté : Poubelles",5),
(41, "Propreté : Epack hygiène",5),
(42, "Propreté : Manuel de cuisine à jour (délai 48h mise en place)",5),
(43, "Propreté : Présence et disponibilité du PMS (imprimé)",5),
(44, "Rangement couteaux et ustensiles",5),
(45, "Seaux et sauce : Propreté",6),
(46, "Seaux et sauce : Filmés",6),
(47, "Seaux et sauce : Datés",6),
(48, "Rangement par catégorie des produits : Viandes",6),
(49, "Rangement par catégorie des produits : Poissons",6),
(50, "Rangement par catégorie des produits : Fromages",6),
(51, "Rangement par catégorie des produits : Produits laitiers",6),
(52, "Rangement par catégorie des produits : Légumes",6),
(53, "Propreté : Réfrigérateurs",6),
(54, "Propreté : Congélateur",6),
(55, "Propreté : Chambre froide",6),
(56, "Inscription des températures de tous les groupes froids",6),
(57, "Matériel non référencé par BARAT CORPORATE",6),
(58, "Bacs gastros ingrédients : Propreté",7),
(59, "Bacs gastros ingrédients : Vétusté",7),
(60, "Produits : Fraicheur bases",7),
(61, "Produits : Fraicheur ingrédients",7),
(62, "Produits : Fraicheur boissons",7),
(63, "Produits : Fraicheur desserts",7),
(64, "Boisson / Fusili / Riz / Dessert : Emballage",7),
(65, "Boisson / Fusili / Riz / Dessert : Présence de la date limite de consommation",7),
(66, "DLC (étiquetage ingrédients)",7),
(67, "Taille des découpes",7),
(68, "Grammage : Bases salades / fusili / riz",7),
(69, "Grammage : Desserts ananas / fromages blancs",7),
(70, "Desserts : Fermeture",7),
(71, "Desserts : Présentation",7),
(72, "Gestion de l'arrivée clientèle par le personnel 'Bonjour Messieurs, Dames'",8),
(73, "Attitude du personnel : Chaleureuse",8),
(74, "Attitude du personnel : Souriante",8),
(75, "Attitude du personnel : Avenante",8),
(76, "Tenue du personnel EAT SALAD et usure : Polo noir EAT SALAD",8),
(77, "Tenue du personnel EAT SALAD et usure : Chaussures noires",8),
(78, "Tenue du personnel EAT SALAD et usure : Pantalon noir",8),
(79, "Tenue du personnel EAT SALAD et usure : Calot noir logo EAT SALAD",8),
(80, "Tenue du personnel EAT SALAD et usure : Tablier vert logo EAT SALAD",8),
(81, "Propreté et repassage des vêtements portés",8),
(82, "Equipements non référencés par BARAT CORPORATE",8),
(83, "Formulation de politesse du personnel",9),
(84, "Comportement du personnel : Serviable",9),
(85, "Comportement du personnel : Attentif",9),
(86, "Comportement du personnel : Aimable",9),
(87, "Accessibilité, disponibilité et visibilité des produits en vente libre-service pour la clientèle : Trois variétés de petits pains",10),
(88, "Accessibilité, disponibilité et visibilité des produits en vente libre-service pour la clientèle : Café et thé",10),
(89, "Accessibilité et visibilité des flyers concept EAT SALAD mis à disposition des clients",10),
(90, "Libre-service clientèle : Propreté des plateaux",10),
(91, "Libre-service clientèle : Présence de set de plateaux",10),
(92, "Rangement de la commande dans le sac",11),
(93, "Présence de produits : Sac kraft à l'intérieur pour boisson ou dessert",11),
(94, "Présence de produits : Kit couverts",11),
(95, "Présence de produits : Flyer",11),
(96, "Armoires réfrigérée : Facing armoire réfrigérée boissons et desserts",12),
(97, "Armoires réfrigérée : Facing armoire réfrigérée bases",12),
(98, "Armoires réfrigérée : Makeline propre et garnie",12),
(99, "Propreté des vitrines réfrigérées",12),
(100, "Lors de la confection d'une salade sur mesure (Quantité des ingrédients et de la sauce)",12),
(101, "Matériel non référencé par BARAT CORPORATE",2);

INSERT OR IGNORE INTO `restaurant` VALUES (1,"BORDEAUX ALBRET","8 COURS D’ALBRET","abidine.daffe@eatsalad.fr",1),
(2,"MÉRIGNAC","128 AVENUE DE LA SOMME","abidine.daffe@eatsalad.fr",2),
(3,"PESSAC","12 AVENUE GUSTAVE EIFFEL","lionel.cassoulet@laposte.net;delphine.dubearn@laposte.net",3),
(4,"SAINT RÉMI","55 RUE SAINT RÉMI","nicolas.moulinet@eatsalad.fr",1),
(5,"CHARTRONS","24 QUAI DE BACALAN","paulinespinasse@gmail.com;eatsaladchartrons@gmail.com;laurentdefay@free.fr",1),
(6,"TOULOUSE","2 RUE PAUL MÉRIEL","sas.rapetout@yahoo.com",4),
(7,"NANTES ZÉNITH","RUE VICTOR SCHOELCHER","charlinebardet1@gmail.com;tom.fonvieille@ece-france.com",5),
(8,"RAVEZIES","198 BOULEVARD GODARD","nicolas.remaut@gmail.com;laurentcoste2911@hotmail.com",1),
(9,"BALMA","15 ESP ANDRE MICHAUX","dca@baschconseil.com;stefmazieres@hotmail.fr",6),
(10,"LE HAILLAN","27 AVENUE DE MAGUDAS","m.lagoubie@cartes-services.fr",7),
(11,"BASSINS À FLOTS","RUE LUCIEN FAURE","melvyn.celu@laposte.net;luis.candelas@free.fr",1),
(12,"STALINGRAD","13 PLACE STALINGRAD","lionel.cassoulet@laposte.net",1),
(13,"PUILBOREAU","82 RUE DU 18 JUIN","nboncorps@gmail.com",8),
(14,"TOURS","50 AVENUE MARCEL MÉRIEUX LOCAL R01 BIS BAS","touatijamel37@gmail.com;tolansuleyman@gmail.com",9),
(15,"VICTOIRE","245 Rue Sainte-Catherine","romainlamoliatte@yahoo.com",1);

INSERT OR IGNORE INTO `ville` VALUES (1,"33000","BORDEAUX"),
(2,"33700","MÉRIGNAC"),
(3,"33600","PESSAC"),
(4,"31000","TOULOUSE"),
(5,"44800","SAINT-HERBLAIN"),
(6,"31130","BALMA"),
(7,"33185","LE HAILLAN"),
(8,"17138","PUILBOREAU"),
(9,"37200","TOURS");

PRAGMA foreign_keys=on;
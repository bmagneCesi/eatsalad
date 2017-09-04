PRAGMA foreign_keys=off;
CREATE TABLE IF NOT EXISTS `restaurant` ( 
	`id_restaurant` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	`name` TEXT NOT NULL, 
	`address` TEXT NOT NULL, 
	`postcode` INTEGER NOT NULL, 
	`city` TEXT NOT NULL,
	`emails` TEXT );

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

INSERT OR IGNORE INTO `response` VALUES (1,"CONFORME",3), (2,"SATISFAIT MAIS À AMÉLIORER",2), (3,"PEU SATISFAIT",1), (4,"TRÈS PEU SATISFAIT",0);
INSERT OR IGNORE INTO `question_subcategory` VALUES (1,"Extérieur",1), (2,"Salle",1), (3,"Espace sanitaire",1), (4,"Sécurité",1), (5,"Cuisine",2), (6,"Chambre Froide",2), (7,"Gestion produits",2), (8,"Accueil clientelle",3), (9,"Départ clientelle",3), (10,"Prise de commande et encaissement",3), (11,"Emporter",3), (12,"Gestion produits",3);
INSERT OR IGNORE INTO `question_category` VALUES (1,"RESTAURANT"), (2,"CUISINE"), (3,"SERVICE CLIENT");
INSERT OR IGNORE INTO `question` VALUES (1,"Propreté de la terrasse",1), (2,"Propreté de la vitrine/façade",1), (3,"Panneau extérieur (présence & propreté)",1), (4,"Propreté et état général (peinture, sol, murs)",2), (5,"Températures",2), (6,"Manuel de service à jour (délai 48h mise en place)",2), (7,"Ambiance lumineuse",2), (8,"Ampoules (en fonction, propreté)",2), (9,"Propreté (tables, pieds de table, chaises)",2), (10,"Assietes (propres et en bon état)",2), (11,"Pinces (propres et en bon état)",2), (12,"Tables inocupées (débarassage, nettoyage)",2), (13,"Musique de fond (volume, pertinence)",2), (14,"État",3), (15,"Propreté",3), (16,"Odeur",3), (17,"Présence et propreté (savon, papier toilette, brosse, sèche-main)",3), (18,"Extinceteurs",4), (19,"Propreté (planches, bacs à salade, robot-coupe, presse-citron, plan de travail gaut et bas, siphons, robinetterie, réserve, murs, sol, poubelles, epack hygiène, manuel de cuisine à jour (délai 48h mise en place), présence et disponibilité du PMS (imprimé))",5), (20,"Rangement couteaux et ustensiles",5), (21,"Sceaux et sauce (propeté, filmés, datés)",6), (22,"Rangement par catégorie des produits (viandes, poissons, fromages, produits laitiers, légumes)",6), (23,"Propreté (réfrigérateurs, congélateur, chambre froide)",6), (24,"Inscription des températures de tous les groupes froids",6), (25,"Matériel non référencé par RABAT CORPORATE",6), (26,"Bacs gastros ingrédients (propreté, vétusté)",7), (27,"Produits (fraicheur bases, fraicheur ingrédients, fraicheur boissons, fraicheur desserts)",7), (28,"Boisson / Fusili / Riz / Desset (emballage, présence de la date limite de consommation)",7), (29,"DLD (étiquetage ingrédients)",7), (30,"Taille des découpes",7), (31,"Grammage (bases salades / fusili / riz, desserts ananas / fromages blancs)",7), (32,"Desserts (fermeture, présentation)",7), (33,"Gestion de l\'arrivée clientèle par le personnel \'Bonjour Messieurs, Dames\'",8), (34,"Attitude du personnel (chaleureuse, souriante, avenante)",8), (35,"Tenue du personnel EAT SALAD et usure (polo noir EAT SALAD, chaussures noires, pantalon noir, calot noir logo EAT SALAD, tablier vert logo EAT SALAD)",8), (36,"Propreté et repassage des vêtements portés",8), (37,"Equipements non référencés par BARAT CORPORATE",8), (38,"Formulation de politesse du personnel",9), (39,"Comportement du personnel (serviable, attentif, aimable)",9), (40,"Accessibilité, disponibilité et visibilité des produits en vente libre-service pour la clientèle (trois variétés de petits pains, café et thé)",10), (41,"Accessibilité et visibilité des flyers concept EAT SALAD mis à disposition des clients",10), (42,"Libre-service clientèle (propreté des plateaux, présence de set de table)",10), (43,"Rangement de la commande dans le sac",11), (44,"Présence de produits (sac kraft à l\'intérieur pour boisson ou dessert, kit couverts, flyer)",11), (45,"Armoires réfrigérée (facing armoire réfrigérée boissons et desserts, facing armoire réfrigérée bases, makeline propre et garnie)",12), (46,"Propreté des vitrines réfrigérées",12), (47,"Lors de la confection d\'une salade sur mesure (Quantité des ingrédients et de la sauce)",12);
INSERT OR IGNORE INTO `restaurant` VALUES (1,"EAT SALAD BORDEAUX ALBRET","8 COURS D’ALBRET","33000","BORDEAUX","abidine.daffe@eatsalad.fr"),(2,"EAT SALAD MÉRIGNAC","128 AVENUE DE LA SOMME","33700","MÉRIGNAC","abidine.daffe@eatsalad.fr"),(3,"EAT SALAD PESSAC","12 AVENUE GUSTAVE EIFFEL","33600","PESSAC","lionel.cassoulet@laposte.net;delphine.dubearn@laposte.net"),(4,"EAT SALAD SAINT RÉMI","55 RUE SAINT RÉMI","33000","BORDEAUX","nicolas.moulinet@eatsalad.fr"),(5,"EAT SALAD CHARTRONS","24 QUAI DE BACALAN","33000","BORDEAUX","paulinespinasse@gmail.com;eatsaladchartrons@gmail.com;laurentdefay@free.fr"),(6,"EAT SALAD TOULOUSE","2 RUE PAUL MÉRIEL","31000","TOULOUSE","sas.rapetout@yahoo.com"),(7,"EAT SALAD NANTES ZÉNITH","RUE VICTOR SCHOELCHER","44800","SAINT-HERBLAIN","charlinebardet1@gmail.com;tom.fonvieille@ece-france.com"),(8,"EAT SALAD RAVEZIES","198 BOULEVARD GODARD","33300","BORDEAUX","nicolas.remaut@gmail.com;laurentcoste2911@hotmail.com"),(9,"EAT SALAD BALMA","15 ESP ANDRE MICHAUX","31130","BALMA","dca@baschconseil.com;stefmazieres@hotmail.fr"),(10,"EAT SALAD LE HAILLAN","27 AVENUE DE MAGUDAS","33185","LE HAILLAN","m.lagoubie@cartes-services.fr"),(11,"EAT SALAD BASSINS À FLOTS","RUE LUCIEN FAURE","33300","BORDEAUX","melvyn.celu@laposte.net;luis.candelas@free.fr"),(12,"EAT SALAD STALINGRAD","13 PLACE STALINGRAD","33100","BORDEAUX","lionel.cassoulet@laposte.net"),(13,"EAT SALAD PUILBOREAU","82 RUE DU 18 JUIN","17138","PUILBOREAU","nboncorps@gmail.com"),(14,"EAT SALAD TOURS","50 AVENUE MARCEL MÉRIEUX LOCAL R01 BIS BAS","37200","TOURS","touatijamel37@gmail.com;tolansuleyman@gmail.com"),(15,"EAT SALAD VICTOIRE","245 Rue Sainte-Catherine","33000","BORDEAUX","romainlamoliatte@yahoo.com");
PRAGMA foreign_keys=on;
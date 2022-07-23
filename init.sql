CREATE TABLE IF NOT EXISTS `links` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `link` varchar(200) NOT NULL,
    `linkName` varchar(200) NOT NULL,
    `userId` int NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Users` (
    `userId` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(200) NOT NULL Unique,
    `email` varchar(200) NOT NULL Unique,
    `password` varchar(200) NOT NULL,
    PRIMARY KEY (`userId`)
);
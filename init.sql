CREATE TABLE IF NOT EXISTS `links` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `link` varchar(20) NOT NULL,
    `linkName` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Users` (
    `userId` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL Unique,
    `email` varchar(20) NOT NULL Unique,
    `password` varchar(20) NOT NULL,
    PRIMARY KEY (`userId`)
);
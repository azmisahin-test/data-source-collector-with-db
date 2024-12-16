CREATE TABLE `source_data` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `service_id` int NOT NULL COMMENT 'Unique identifier for each service; foreign key linking to the services table',
    `language_code` char(2) NOT NULL COMMENT 'ISO 639-1 two-letter language code (e.g., ''EN'', ''TR'', ''CN'')',
    `language_name` varchar(50) NOT NULL COMMENT 'Full name of the language (e.g., ''English'', ''Turkish'')',
    `country_code` char(2) NOT NULL COMMENT 'ISO 3166-1 alpha-2 country code (e.g., ''US'', ''TR'')',
    `country_name` varchar(255) NOT NULL COMMENT 'Full name of the country in English (e.g., ''Turkey'')',
    `title` varchar(255) NOT NULL COMMENT 'Title of the service in the specified language and country',
    `interest` int COMMENT 'Interest level or score related to the service, if applicable',
    `source_timestamp` TIMESTAMP COMMENT 'Timestamp when the data was collected from the source; useful for tracking the data\'s origin time',
    `collection_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the record is created; useful for tracking data collection times',
    FOREIGN KEY (`service_id`) REFERENCES `source` (`service_id`) ON DELETE CASCADE
);
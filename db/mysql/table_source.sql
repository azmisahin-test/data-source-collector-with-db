CREATE TABLE `source` (
    `service_id` int AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique identifier for each service; serves as the primary key for the table',
    `service_type_name` varchar(50) NOT NULL COMMENT 'Name of the type',
    `access_type_id` int NOT NULL COMMENT 'Reference to access_types table; specifies access method (1: api, 2: rss, 3: html )',
    `access_type_name` varchar(50) NOT NULL COMMENT 'Name of the type (API, RSS, HTML, Influx Database, Elasticsearch, MySql, Mongo Database, Postgresql Database, ... )',
    `access_method_id` int NOT NULL COMMENT 'Reference to access_method_types table; indicates how the service can be accessed (1: free, 2: open_access, 3: subscription)',
    `access_method_name` varchar(50) NOT NULL COMMENT 'Name of the type (Open Access, Free, Subscription, ...)',
    `service_status_id` int NOT NULL DEFAULT '0' COMMENT '1: active, 2: inactive, 3: maintenance, 4: under_review, 5: suspended, ...; from status_types ',
    `service_status` varchar(50) NOT NULL COMMENT 'Name of the status type',
    `fetch_frequency` int NOT NULL DEFAULT '0' COMMENT 'Frequency (in seconds) at which data will be fetched from the external source',
    `time_interval` int NOT NULL DEFAULT '0' COMMENT 'Time interval in which the data source provides data (0: real-time)',
    `next_fetch` timestamp NULL DEFAULT NULL COMMENT 'Timestamp for when the next fetch will occur; calculated automatically based on fetch frequency (timestamptz)',
    `last_fetched` timestamp NULL DEFAULT NULL COMMENT 'Timestamp for when the data was last fetched; updated during each fetch (timestamptz)',
    `last_error_message` text COMMENT 'Stores the last error message encountered during data fetching; could be useful for debugging (any error exception)',
    `language_code` char(2) NOT NULL COMMENT 'Unique ISO 639-1 two-letter language code (e.g., ''EN'', ''TR'', ''CN'')',
    `language_name` varchar(50) NOT NULL COMMENT 'Full name of the language (e.g., ''English'', ''Turkish'')',
    `country_code` char(2) NOT NULL COMMENT 'ISO 3166-1 alpha-2 country code (e.g., ''US'', ''TR'')',
    `country_name` varchar(255) NOT NULL COMMENT 'Full name of the country in English (e.g., ''Turkey'')',
    `data_format_id` int NOT NULL DEFAULT '0',
    `data_format_code` varchar(20) NOT NULL COMMENT 'Unique code for each type (json, xml, csv, html, yaml, ... )',
    `platform_id` int DEFAULT NULL COMMENT 'Unique identifier for each platform; serves as the primary key for the table',
    `platform_code` varchar(20) COMMENT 'Unique code for each  (google_trends, open_meteo, ... )',
    `platform_name` varchar(50) COMMENT 'Name of the platform (e.g., Google Trends, Open-Meteo); serves as a concise reference for the platform',
    `platform_description` varchar(255) DEFAULT NULL COMMENT 'Description providing general information about the platform; offers context and details about its purpose and functionalities',
    `platform_status_id` int DEFAULT NULL COMMENT '1: active, 2: inactive, 3: maintenance, 4: under_review, 5: suspended, ...; from status_types ',
    `platform_status` varchar(50) COMMENT 'Name of the status type',
    `full_url` text
);

ALTER TABLE source
ADD COLUMN rate_limit INT DEFAULT 1,
ADD COLUMN timeout INT DEFAULT 30;

update `source`
set
    fetch_frequency = 300,
    rate_limit = 1,
    timeout = 10;

CREATE TRIGGER update_next_fetch_before_insert
BEFORE INSERT
ON source
FOR EACH ROW
SET
    NEW.next_fetch = DATE_ADD(
        NOW(),
        INTERVAL NEW.fetch_frequency SECOND
    );
CREATE TRIGGER update_next_fetch_before_update
BEFORE UPDATE
ON source
FOR EACH ROW
SET
    NEW.next_fetch = DATE_ADD(
        NOW(),
        INTERVAL NEW.fetch_frequency SECOND
    );

INSERT INTO
    `source`
VALUES (
        1,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'EN',
        'English',
        'US',
        'United States',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=US'
    ),
    (
        2,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        2,
        'Inactive',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'ZH',
        'Chinese',
        'CN',
        'China',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=CN'
    ),
    (
        3,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'JA',
        'Japanese',
        'JP',
        'Japan',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=JP'
    ),
    (
        4,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'KO',
        'Korean',
        'KR',
        'Korea, Republic of',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=KR'
    ),
    (
        5,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'HI',
        'Hindi',
        'IN',
        'India',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=IN'
    ),
    (
        6,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'PT',
        'Portuguese',
        'BR',
        'Brazil',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=BR'
    ),
    (
        7,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'DE',
        'German',
        'DE',
        'Germany',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=DE'
    ),
    (
        8,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'EN',
        'English',
        'GB',
        'United Kingdom',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=GB'
    ),
    (
        9,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'FR',
        'French',
        'FR',
        'France',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=FR'
    ),
    (
        10,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'RU',
        'Russian',
        'RU',
        'Russian Federation',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=RU'
    ),
    (
        11,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'EN',
        'English',
        'AU',
        'Australia',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=AU'
    ),
    (
        12,
        'API Service',
        2,
        'Web Rss/Xml',
        2,
        'Free',
        1,
        'Active',
        300,
        0,
        NULL,
        NULL,
        NULL,
        'TR',
        'Turkish',
        'TR',
        'Turkey',
        2,
        'xml',
        1,
        'google_trends',
        'Google Trends',
        'Real-time trends by Google',
        1,
        'Active',
        'https://trends.google.com/trending/rss?geo=TR'
    );
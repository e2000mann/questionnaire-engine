CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE up887818web;
DROP TABLE IF EXISTS up887818web;

-- json boolean value is used to show user's preference in exporting questionnaire answers - true means json, false means csv

CREATE TABLE IF NOT EXISTS up887818web (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text,
  email text,
  json boolean
);

-- pre generated uuids for testing
INSERT INTO up887818web (id, name, email, json) VALUES
('4d87e050-e74f-4de7-a144-6c76dac3622e', 'Example Questionnaire', 'up887818@myport.ac.uk', TRUE);

-- creating user for server to use
create user serverconnect password 'webProgCw' superuser;


-- how to delete afterwards
-- drop database up887818web;
-- drop user serverconnect;

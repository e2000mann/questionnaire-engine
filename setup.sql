CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS up887818;

-- json boolean value is used to show user's preference in exporting questionnaire answers - true means json, false means csv

CREATE TABLE IF NOT EXISTS up887818 (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text,
  email text,
  json boolean
);

-- pre generated uuids for testing
INSERT INTO up887818 (id, name, email, json) VALUES
('4d87e050-e74f-4de7-a144-6c76dac3622e', 'example-questionnaire', 'up887818@myport.ac.uk', TRUE);

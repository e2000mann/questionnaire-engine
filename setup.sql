CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS up887818;

CREATE TABLE IF NOT EXISTS up887818 (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text,
  email text
);

-- pre generated uuids for testing
INSERT INTO up887818 (id, name, email) VALUES
('4d87e050-e74f-4de7-a144-6c76dac3622e', 'example-questionnaire', 'rjb@port.ac.uk'),
('3cdb2fea-4619-46cc-8b22-223f42f97ada', 'emmas-questionnaire', 'up887818@myport.ac.uk');

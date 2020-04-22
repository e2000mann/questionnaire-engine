CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS up887818;

CREATE TABLE IF NOT EXISTS up887818 (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text,
  email text
);

INSERT INTO up887818 (name, email) VALUES
('example-questionnaire', 'rjb@port.ac.uk'),
('emmas-questionnaire', 'up887818@myport.ac.uk');

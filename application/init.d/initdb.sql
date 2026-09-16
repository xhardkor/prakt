/*k: Lifters */
CREATE TABLE lifters (
  id SERIAL PRIMARY KEY,

  first_name VARCHAR(50) NOT NULL,
  second_name VARCHAR(50) NOT NULL,

  b_day date NOT NULL,

  sex char(1)
    CHECK (Sex IN ('M', 'F'))
    NOT NULL
);
INSERT INTO lifters (first_name, second_name, b_day, sex)
VALUES
('testname', 'testsurname', '2000-03-21', 'M');


/*k: List of Divisions */
CREATE TABLE division_list (
  id SERIAL PRIMARY KEY,
  name varchar(32) UNIQUE NOT NULL
);
INSERT INTO division_list (name)
VALUES 
('Open'),
('SubJunior'),
('Juniors'),
('Seniors'),
('Masters1'),
('Masters2'),
('Masters3'),
('Masters4'),
('SOI');
/*k: List of Weight classes */
CREATE TABLE weight_class_list (
  id SERIAL PRIMARY KEY,
  name varchar(16) NOT NULL
);
INSERT INTO weight_class_list (name)
VALUES
('-43kg'),
('-47kg'),
('-52kg'),
('-57kg'),
('-63kg'),
('-69kg'),
('-76kg'),
('-84kg'),
('84+kg');


/*k: Data for competition 
* Sportsman entry */
CREATE TABLE competition_entries (
  id SERIAL PRIMARY KEY,

  lifter_id INT
    REFERENCES lifters(id)
    ON DELETE CASCADE,
  division_id INT
    REFERENCES division_list(id),
  weight_class_id INT
    REFERENCES weight_class_list(id),

  body_weight NUMERIC(5,2)
    CHECK (body_weight > 0),
  lot_number INT,
  group_number INT,

  record_disqualified varchar(16)
    CHECK (record_disqualified IN ('Not Disqualified','Disqualified'))
    DEFAULT 'Not Disqualified'
);
INSERT INTO competition_entries (lifter_id, division_id, weight_class_id, body_weight, lot_number, group_number)
VALUES
(1, 2, 5, 60.00, 14, 1);


/*k: Attempts */
CREATE TABLE attempts (
  id SERIAL PRIMARY KEY,

  competition_entry_id INT
    REFERENCES competition_entries(id)
    ON DELETE CASCADE,

  lift_type VARCHAR(2)
    CHECK (lift_type IN ('SQ', 'BP', 'DL')),

  attempt_number INT
    CHECK (attempt_number BETWEEN 1 AND 3),

  weight NUMERIC(5,2)
    CHECK (weight > 0)
    NOT NULL,
  
  UNIQUE (
    competition_entry_id,
    lift_type,
    attempt_number
  )
);
INSERT INTO attempts (competition_entry_id, lift_type, attempt_number, weight)
VALUES (1, 'SQ', 1, 65);

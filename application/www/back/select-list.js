//fo: LISTS
//k:
export const LIST_COMPETITION_ENTRIES_QUERY = `
SELECT

-- competition entry
ce.id AS comp_id,
ce.body_weight,

-- lifter
l.id AS lifter_id,
l.first_name AS lifter_first_name,
l.second_name AS lifter_second_name,

-- division
dl.name AS division_name,

-- weight class
wcl.name AS weight_class_name,

-- remaining competition entry
ce.lot_number,
ce.group_number,
ce.record_disqualified

-- Joins
FROM competition_entries ce

LEFT JOIN lifters l
ON ce.lifter_id = l.id

LEFT JOIN division_list dl
ON ce.division_id = dl.id

LEFT JOIN weight_class_list wcl
ON ce.weight_class_id = wcl.id

ORDER BY ce.id ASC; 
`
//k:
export const LIST_LIFTERS_QUERY = `
SELECT *
FROM lifters
ORDER BY id ASC;
`
//k:
export const LIST_ATTEMPTS_QUERY = `
SELECT *
FROM attempts;
`
//k:
export const LIST_DIVISIONS_QUERY = `
SELECT *
FROM division_list;
`
//k:
export const LIST_WEIGHT_CLASS_QUERY = `
SELECT *
FROM weight_class_list;
`

//fo: LIFTER
//k:
export const ADD_LIFTER= `
INSERT INTO lifters (first_name, second_name, b_day, sex)
VALUES ($1, $2, $3, $4);
`
//k:
export const DELETE_LIFTER= `
DELETE FROM lifters
WHERE id=$1;
`

//fo: ENTRY
//k:
export const ADD_ENTRY = `
INSERT INTO competition_entries (lifter_id, division_id, weight_class_id, body_weight, lot_number, group_number, record_disqualified)
VALUES ($1, $2, $3, $4, $5, $6, $7);
`
//k:
export const DELETE_ENTRY= `
DELETE FROM competition_entries
WHERE id=$1;
`

//fo: ATTEMPT
//k:
export const ADD_ATTEMPT = `
INSERT INTO attempts (competition_entry_id, lift_type, attempt_number, weight)
VALUES ($1, $2, $3, $4);
`
//k:
export const DELETE_ATTEMPT= `
DELETE FROM attempts
WHERE id=$1;
`
//k:
export const DISPLAY_ATTEMPT= `
SELECT
CASE a.lift_type
  WHEN 'SQ' THEN 'Squat'
  WHEN 'BP' THEN 'Bench Press'
  WHEN 'DL' THEN 'Deadlift'
END AS attempt_name,
'att. ' || a.attempt_number AS attempt_number,
wcl.name AS weight_class,
l.first_name,
l.second_name,
a.weight

FROM attempts a
JOIN competition_entries ce
    ON a.competition_entry_id = ce.id

JOIN lifters l
    ON ce.lifter_id = l.id

JOIN weight_class_list wcl
    ON ce.weight_class_id = wcl.id

WHERE a.id=$1;
`

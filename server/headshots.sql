SELECT kills,
       heads,
       round(heads / kills::dec * 100, 2) as ratio,
       date
FROM stats
WHERE _id = $1;
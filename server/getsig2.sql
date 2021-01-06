SELECT kills,
       deaths,
       round(heads / kills::dec * 100, 2) as "hsPercentage",
       wins,
       (plays - wins - draws) as losses,
       date
FROM stats
WHERE _id = $1
ORDER BY date DESC
LIMIT 1;

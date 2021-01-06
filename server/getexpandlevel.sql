SELECT exp, level, date
FROM stats
WHERE _id = $1
ORDER BY date DESC
LIMIT 1;
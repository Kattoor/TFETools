SELECT "displayName"
FROM stats
WHERE _id = $1
LIMIT 1;
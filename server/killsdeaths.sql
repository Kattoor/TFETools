SELECT kills,
       deaths,
       round(kills / deaths::dec, 2) as ratio,
       date
FROM stats
WHERE _id = $1;
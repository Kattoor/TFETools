SELECT wins,
       (plays - wins - draws) as losses,
       draws,
       date
FROM stats
WHERE _id = $1;

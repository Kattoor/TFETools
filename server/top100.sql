SELECT lastRecordOfPlayer._id,
       "displayName",
       level,
       exp,
       plays,
       wins,
       draws,
       kills,
       deaths,
       heads,
       "sniperKills",
       "knifeKills",
       heals,
       revivals,
       points,
       "timeInZone",
       "pspTaken",
       "flagsTaken",
       "flagsTaking",
       ROW_NUMBER() OVER (ORDER BY lastRecordOfPlayer.exp DESC) as "currentRank",
       sub.rank as "previousRank"
FROM (
         SELECT *,
                ROW_NUMBER() OVER (PARTITION BY _id ORDER BY date DESC) rn
         FROM stats
     ) lastRecordOfPlayer

         LEFT JOIN (
    SELECT _id, date, ROW_NUMBER() OVER (ORDER BY exp DESC) as rank
    FROM (
             SELECT _id, date, exp, ROW_NUMBER() OVER (PARTITION BY _id ORDER BY date DESC) rnYesterday
             FROM stats
             WHERE date < ((SELECT MAX(date) FROM stats) - 86400000)
         ) lastRecordOfPlayerYesterday
    WHERE rnYesterday = 1
    ORDER BY exp DESC
    LIMIT 100
) sub ON lastRecordOfPlayer._id = sub._id
WHERE rn = 1
ORDER BY exp DESC
LIMIT 100;

SELECT _id,
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
       "flagsTaking"

FROM (
         SELECT *, ROW_NUMBER() OVER (PARTITION BY _id ORDER BY date DESC) rn
         FROM stats
     ) onlyGetMostRecentRecordOfPlayer
where rn = 1
order by exp desc
limit 100;
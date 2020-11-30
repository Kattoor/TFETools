/* Activity */
SELECT "displayName",
       level,
       plays,
       wins,
       draws,
       kills,
       to_char(to_timestamp(cast(date / 1000 as bigint)), 'DD Mon HH24:MI') as date
FROM (
         SELECT *, ROW_NUMBER() OVER (PARTITION BY plays ORDER BY date) rn
         FROM (
                  SELECT "displayName", level, plays, wins, draws, kills, date
                  FROM stats
                  WHERE _id = $1) onlyGetUserOfThisID
     ) onlyGetFirstRecordWhenPlaysChanged
WHERE rn = 1;
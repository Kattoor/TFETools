with result as (SELECT s1._id,
                       s1."displayName",
                       s2.wins - s1.wins                   AS "deltaWins",
                       s2.kills - s1.kills                 AS "deltaKills",
                       s2."timeInZone" - s1."timeInZone"   AS "deltaTimeInZone",
                       s2.revivals - s1.revivals           AS "deltaRevivals",
                       s2."sniperKills" - s1."sniperKills" AS "deltaSniperKills",
                       s2.plays - s1.plays                 AS "deltaPlays"
                FROM (SELECT _id, MIN(date) AS firstDate, MAX(date) AS lastDate
                      FROM stats
                      WHERE date BETWEEN $1 AND $2
                      GROUP BY _id) AS record
                         JOIN stats AS s1 ON s1.date = record.firstDate AND s1._id = record._id
                         JOIN stats AS s2 ON s2.date = record.lastDate AND s2._id = record._id)
    (
        (SELECT _id,
                "displayName",
                "deltaWins"                                   AS value,
                "deltaPlays"                                  AS plays,
                'winner'                                      AS type,
                ROW_NUMBER() OVER (ORDER BY "deltaWins" DESC) AS rn
         FROM result
         ORDER BY "deltaWins" DESC
         LIMIT 3)
        UNION
        (SELECT _id,
                "displayName",
                "deltaKills"                                   AS value,
                "deltaPlays"                                   AS plays,
                'killer'                                       AS type,
                ROW_NUMBER() OVER (ORDER BY "deltaKills" DESC) AS rn
         FROM result
         ORDER BY "deltaKills" DESC
         LIMIT 3)
        UNION
        (SELECT _id,
                "displayName",
                "deltaTimeInZone"                                   AS value,
                "deltaPlays"                                        AS plays,
                'zoner'                                             AS type,
                ROW_NUMBER() OVER (ORDER BY "deltaTimeInZone" DESC) AS rn
         FROM result
         ORDER BY "deltaTimeInZone" DESC
         LIMIT 3)
        UNION
        (SELECT _id,
                "displayName",
                "deltaRevivals"                                   AS value,
                "deltaPlays"                                      AS plays,
                'medic'                                           AS type,
                ROW_NUMBER() OVER (ORDER BY "deltaRevivals" DESC) AS rn
         FROM result
         ORDER BY "deltaRevivals" DESC
         LIMIT 3)
        UNION
        (SELECT _id,
                "displayName",
                "deltaSniperKills"                                   AS value,
                "deltaPlays"                                         AS plays,
                'sniper'                                             AS type,
                ROW_NUMBER() OVER (ORDER BY "deltaSniperKills" DESC) AS rn
         FROM result
         ORDER BY "deltaSniperKills" DESC
         LIMIT 3)
    )
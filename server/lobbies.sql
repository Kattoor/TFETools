SELECT dsc,
       "roomName",
       map,
       "gameModeString",
       "mapRotation",
       "totalAmountOfPlayers",
       "maxPlayer",
       "blueTeam",
       "redTeam",
        "country",
       "steamStartUrl",
       round((json_array_length("blueTeam") + json_array_length("redTeam")) / "maxPlayer"::dec * 100)::int as "percentageFilled"
FROM lobbies

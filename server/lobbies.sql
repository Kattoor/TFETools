SELECT dsc,
       "roomName",
       map,
       "gameModeString",
       "mapRotation",
       "totalAmountOfPlayers",
       "maxPlayer",
       "blueTeam",
       "redTeam",
        "countryFlag",
       "steamStartUrl",
       round((json_array_length("blueTeam") + json_array_length("redTeam")) / "maxPlayer"::dec * 100, 2) as percentageFilled
FROM lobbies

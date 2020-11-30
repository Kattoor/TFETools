process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

const https = require('https');

const http = require('http');
const fs = require('fs');
const path = require('path');

const {Pool} = require('pg');

const SteamAuth = require('node-steam-openid');

const steam = new SteamAuth({
    //realm: "http://localhost:4201",
    //returnUrl: "http://localhost:4201/auth/steam/authenticate",
    realm: "http://tfe.tools",
    returnUrl: "http://tfe.tools/auth/steam/authenticate",
    apiKey: ""
});

const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
});

const queries = {
    killsDeaths: fs.readFileSync('./killsdeaths.sql', 'utf-8'),
    top100: fs.readFileSync('./top100.sql', 'utf-8'),
    activity: fs.readFileSync('./activity.sql', 'utf-8'),
    headshots: fs.readFileSync('./headshots.sql', 'utf-8'),
    tkothZoneTimer: fs.readFileSync('./tkothZoneTimer.sql', 'utf-8'),
    gameWinsLossesDraws: fs.readFileSync('./gameWinsLossesDraws.sql', 'utf-8'),
    displayName: fs.readFileSync('./displayName.sql', 'utf-8'),
    addUserByOptIn: fs.readFileSync('./addUserByOptIn.sql', 'utf-8')
};

async function query(text, values) {
    try {
        return (await pool.query(text, values)).rows;
    } catch (e) {
        console.log('Error!');
        console.log(e);
    }
}

function getServerIPsBySteamID(steamId) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.steampowered.com/IGameServersService/GetServerIPsBySteamID/v1?key=&input_json=%7B%22server_steamids%22:%5B' + steamId + '%5D%7D';
        https.get(url, res => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', chunk => rawData += chunk);
            res.on('end', async () => resolve(rawData));
        }).on('error', () => reject());
    });
}

function getFlagsByIp(ip) {
    return new Promise((resolve, reject) => {
        const url = 'http://api.ipstack.com/' + ip + '?access_key=';
        http.get(url, res => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', chunk => rawData += chunk);
            res.on('end', async () => resolve(rawData));
        }).on('error', () => reject());
    });
}

function getRooms() {
    return new Promise((resolve, reject) => {
        https.get('https://ns548971.ip-66-70-179.net:80/tfe-rest-api/v1/rooms-info/get', res => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', chunk => rawData += chunk);
            res.on('end', async () => resolve(rawData));
        }).on('error', () => reject());
    });
}

let rooms;

(async () => {
    rooms = await getRooms();
    setInterval(async () => {
        try {
            rooms = await getRooms()
        } catch (e) {
            console.log('Error getting rooms');
        }
    }, 10000);

    http.createServer(async (request, response) => {
        console.log(request.url);
        await handleReq(request, response);
    /*}).listen(80);*/
    }).listen(4201);
})();

async function handleReq(request, response) {
    let url = request.url;
    response.setHeader('Access-Control-Allow-Origin', '*');
    if (url === '/auth/steam') {
        const redirectUrl = await steam.getRedirectUrl();
        response.writeHead(302, {'Location': redirectUrl});
        response.end();
    } else if (url.startsWith('/auth/steam/authenticate')) {
        try {
            const user = await steam.authenticate(request);
            await query(queries.addUserByOptIn, [user.steamid]);
            /*response.writeHead(302, {'Location': 'http://localhost:4200/stats/individual;id=' + user.steamid});*/
            response.writeHead(302, {'Location': 'http://tfe.tools/stats/individual;id=' + user.steamid});
            response.end();
        } catch (error) {
            console.error(error);
        }
    } else if (url.startsWith('/api/')) {
        if (url === '/api/lobbies/rooms-info') {
            response.end(rooms, 'utf-8');
        } else if (url === '/api/stats/top100') {
            const top100 = await query(queries.top100);
            response.end(JSON.stringify(top100), 'utf-8');
        } else if (url.startsWith('/api/stats/individual/killsdeaths?id=')) {
            const steamId = url.split('id=')[1];
            const stats = await query(queries.killsDeaths, [steamId]);
            response.end(JSON.stringify(stats), 'utf-8');
        } else if (url.startsWith('/api/stats/individual/activity?id=')) {
            const steamId = url.split('id=')[1];
            const stats = await query(queries.activity, [steamId]);
            response.end(JSON.stringify(stats), 'utf-8');
        } else if (url.startsWith('/api/stats/individual/gamewinslossesdraws?id=')) {
            const steamId = url.split('id=')[1];
            const stats = await query(queries.gameWinsLossesDraws, [steamId]);
            response.end(JSON.stringify(stats), 'utf-8');
        } else if (url.startsWith('/api/stats/individual/tkothzonetimer?id=')) {
            const steamId = url.split('id=')[1];
            const stats = await query(queries.tkothZoneTimer, [steamId]);
            response.end(JSON.stringify(stats), 'utf-8');
        } else if (url.startsWith('/api/stats/individual/headshots?id=')) {
            const steamId = url.split('id=')[1];
            const stats = await query(queries.headshots, [steamId]);
            response.end(JSON.stringify(stats), 'utf-8');
        } else if (url.startsWith('/api/stats/individual/displayname?id=')) {
            const steamId = url.split('id=')[1];
            const stats = await query(queries.displayName, [steamId]);
            response.end(JSON.stringify(stats), 'utf-8');
        } else if (url.startsWith('/api/steam/GetServerIPsBySteamID?id=')) {
            const steamId = url.split('?id=')[1];
            const data = await getServerIPsBySteamID(steamId);
            response.end(data);
        } else if (url.startsWith('/api/flags?ip=')) {
            const ip = url.split('?ip=')[1];
            const data = await getFlagsByIp(ip);
            response.end(data);
        }
    } else {
        let filePath = '../dist/' + request.url;
        if (filePath === '../dist//')
            filePath = '../dist/index.html';

        const extname = path.extname(filePath);
        let contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }

        fs.readFile(filePath, function (error, content) {
            if (error) {
                if (error.code === 'ENOENT') {
                    fs.readFile('../dist/index.html', function (error, content) {
                        response.writeHead(200, {'Content-Type': contentType});
                        response.end(content, 'utf-8');
                    });
                } else {
                    console.log(filePath);
                    console.log(error);
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                    response.end();
                }
            } else {
                response.writeHead(200, {'Content-Type': contentType});
                response.end(content, 'utf-8');
            }
        });
    }
}

console.log('Server running at http://127.0.0.1:4201/');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const {Pool} = require('pg');

const SteamAuth = require('node-steam-openid');

const steam = new SteamAuth({
    //realm: 'http://localhost:4201',
    //returnUrl: 'http://localhost:4201/auth/steam/authenticate',
    realm: 'http://tfe.gg',
    returnUrl: 'http://tfe.gg/auth/steam/authenticate',
    apiKey: ''
});

const production = false;

const options = {
    key: production ? fs.readFileSync('/etc/letsencrypt/live/tfe.gg/privkey.pem') : '',
    cert: production ? fs.readFileSync('/etc/letsencrypt/live/tfe.gg/fullchain.pem') : ''
};

const {createCanvas, loadImage, registerFont} = require('canvas');
registerFont('./OpenSans-Regular.ttf', {family: 'OpenSans'})

const expForLevel = [
    0, 500, 1500, 4000, 6000, 8000, 10000, 12000, 14000, 16000,
    18000, 21000, 24000, 27000, 30000, 33000, 36000, 39000, 42000, 45000,
    48000, 51000, 54000, 57000, 60000, 63000, 66000, 69000, 72000, 75000,
    79000, 83000, 87000, 91000, 95000, 99000, 103000, 107000, 111000, 115000,
    119000, 123000, 127000, 131000, 135000, 139000, 143000, 147000, 151000, 155000,
    160000, 165000, 170000, 175000, 180000, 185000, 190000, 195000, 200000, 205000,
    210000, 215000, 220000, 225000, 230000, 235000, 240000, 245000, 250000, 255000,
    261000, 267000, 273000, 279000, 285000, 291000, 297000, 303000, 310000, 317000,
    324000, 331000, 338000, 345000, 352000, 360000, 368000, 376000, 384000, 392000,
    400000, 408000, 417000, 426000, 435000, 444000, 453000, 463000, 463000, 483000,
    493000, 503000, 514000, 525000, 536000, 547000, 558000, 570000, 582000, 594000,
    606000, 619000, 632000, 656000, 658000, 672000, 686000, 700000, 714000, 729000,
    744000, 759000, 775000, 791000, 807000, 824000, 841000, 858000, 876000, 894000,
    912000, 931000, 950000, 969000, 989000, 1009000, 1030000, 1051000, 1073000, 1095000,
    1117000, 1140000, 1163000, 1187000, 1211000, 1236000, 1261000, 1287000, 1313000, 1340000
];

const imageForLevel = [
    'Private',
    'PrivateFirst',
    'Specialist',
    'Corporal',
    'Sergeant',
    'StaffSergeant',
    'SergeantFirstClass',
    'MasterSergeant',
    'FirstSergeant',
    'SergeantMajor',
    'CommandSergeantMajor',
    'WarrantOfficer',
    'ChiefWarrantOfficer',
    'SecondLieutenant',
    'FirstLieutenant',
    'Captain',
    'Major',
    'LieutenantColonel',
    'Colonel',
    'BrigadierGeneral',
    'MajorGeneral',
    'LieutenantGeneral',
    'General',
    'BrigadierGeneral',
    'MajorGeneral',
    'LieutenantGeneral',
    'General',
    'GeneralOfArmy'
];

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
    addUserByOptIn: fs.readFileSync('./addUserByOptIn.sql', 'utf-8'),
    rooms: fs.readFileSync('./lobbies.sql', 'utf-8'),
    getAllNames: fs.readFileSync('./getallnames.sql', 'utf-8'),
    getExpAndLevel: fs.readFileSync('./getexpandlevel.sql', 'utf-8'),
    getSig2: fs.readFileSync('./getsig2.sql', 'utf-8'),
    topPlayers7Days: fs.readFileSync('./topplayers7days.sql', 'utf-8')
};

async function query(text, values) {
    try {
        return (await pool.query(text, values)).rows;
    } catch (e) {
        console.log('Error!');
        console.log(e);
    }
}

(async () => {
    if (production) {
        https.createServer(options, async (request, response) => {
            await handleReq(request, response);
        }).listen(443);

        http.createServer((request, response) => {
            response.writeHead(301, {'Location': 'https://tfe.gg' + request.url})
            response.end();
        }).listen(80);
    } else {
        http.createServer(async (request, response) => await handleReq(request, response)).listen(4201);
    }
})();

function getPercentageOfLevelCompleted(expAndLevel) {
    const expNeededForCurrentLevel = expForLevel[expAndLevel.level - 1];
    const expNeededForNextLevel = expForLevel[expAndLevel.level];
    const expBetweenLevels = expNeededForNextLevel - expNeededForCurrentLevel;
    return (expAndLevel.exp - expNeededForCurrentLevel) / expBetweenLevels * 100;
}

const canvasSig1Width = 600;
const canvasSig2Width = 510;
const canvasSig1Height = 50;
const canvasSig2Height = 50;

function drawRoundRect(ctx, color, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

async function createSigImage(expAndLevel, response) {
    const canvas = createCanvas(canvasSig1Width, canvasSig1Height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(52, 66, 59)';
    ctx.fillRect(0, 0, canvasSig1Width, canvasSig1Height);

    const firstIcon = await loadImage('./ranks/' + expAndLevel.imageCurrentLevel + '.png');
    const secondIcon = await loadImage('./ranks/' + expAndLevel.imageNextLevel + '.png');

    const maxWidthHeight = 100;
    const padding = 5;

    const firstIconWidth = firstIcon.width > firstIcon.height ? Math.min(maxWidthHeight, firstIcon.width) : firstIcon.width / (firstIcon.height / maxWidthHeight);
    const firstIconHeight = firstIcon.height > firstIcon.width ? Math.min(maxWidthHeight, firstIcon.height) : firstIcon.height / (firstIcon.width / maxWidthHeight);

    const secondIconWidth = secondIcon.width > secondIcon.height ? Math.min(maxWidthHeight, secondIcon.width) : secondIcon.width / (secondIcon.height / maxWidthHeight);
    const secondIconHeight = secondIcon.height > secondIcon.width ? Math.min(maxWidthHeight, secondIcon.height) : secondIcon.height / (secondIcon.width / maxWidthHeight);

    ctx.drawImage(firstIcon, 0, canvasSig1Height / 2 - firstIconHeight / 2, firstIconWidth, firstIconHeight);
    ctx.drawImage(secondIcon, canvasSig1Width - secondIconWidth, canvasSig1Height / 2 - secondIconHeight / 2, secondIconWidth, secondIconHeight);

    const x = maxWidthHeight + padding;
    const y = 21;
    const w = canvasSig1Width - maxWidthHeight * 2 - padding * 2;
    const h = 8;
    let r = 20;
    drawRoundRect(ctx, '#0c110f', x, y, w, h, r);

    const gradient = ctx.createLinearGradient(0, 0, w * expAndLevel.percentageOfLevelCompleted / 100, 0);
    gradient.addColorStop(0, '#2c523e');
    gradient.addColorStop(1, '#419659');
    drawRoundRect(ctx, gradient, x, y, w * expAndLevel.percentageOfLevelCompleted / 100, h, r);

    const pngStream = canvas.toBuffer();
    response.writeHead(200, {'Content-type': 'image/png'});
    response.end(pngStream);
}

async function createSig2Image(stats, response) {
    const canvas = createCanvas(canvasSig2Width, canvasSig2Height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(52, 66, 59)';
    ctx.fillRect(0, 0, canvasSig2Width, canvasSig2Height);

    const padding = 5;

    ctx.font = '22px "OpenSans"';
    ctx.fillStyle = 'white';

    const firstRowTop = canvas.height / 2 - padding;
    const secondRowTop = ctx.measureText(stats.hsPercentage).actualBoundingBoxAscent + canvas.height / 2 + padding;

    const firstColumnLeft = padding;
    const secondColumnLeftValue = 250 - ctx.measureText(stats.hsPercentage).width / 2;
    const secondColumnLeftLabel = 250 - ctx.measureText('HS percentage').width / 2;
    const thirdColumnLeft = 400;

    const firstColumnLabelsLeft = Math.max(ctx.measureText(stats.kills).width, ctx.measureText(stats.deaths).width) + padding;
    const thirdColumnLabelsLeft = Math.max(ctx.measureText(stats.wins).width, ctx.measureText(stats.losses).width) + padding;

    /* Values */
    ctx.fillStyle = '#419659';
    ctx.fillText(stats.kills, firstColumnLeft, firstRowTop);
    ctx.fillText(stats.wins, thirdColumnLeft, firstRowTop);

    ctx.fillStyle = '#f64e60';
    ctx.fillText(stats.deaths, padding, secondRowTop);
    ctx.fillText(stats.losses, thirdColumnLeft, secondRowTop);

    ctx.fillStyle = '#FFBF00';
    ctx.fillText(stats.hsPercentage, secondColumnLeftValue, secondRowTop);

    /* Labels */
    ctx.fillStyle = 'white';
    ctx.fillText('kills', firstColumnLeft + firstColumnLabelsLeft, firstRowTop);
    ctx.fillText('wins', thirdColumnLeft + thirdColumnLabelsLeft, firstRowTop);
    ctx.fillText('deaths', firstColumnLeft + firstColumnLabelsLeft, secondRowTop);
    ctx.fillText('HS percentage', secondColumnLeftLabel, firstRowTop);
    ctx.fillText('losses', thirdColumnLeft + thirdColumnLabelsLeft, secondRowTop);

    const pngStream = canvas.toBuffer();
    response.writeHead(200, {'Content-type': 'image/png'});
    response.end(pngStream);
}

const steamDataCache = {};

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
            /*response.writeHead(302, {'Location': 'https://localhost:4200/stats/individual;id=' + user.steamid});*/
            response.writeHead(302, {'Location': 'https://tfe.gg/stats/individual;id=' + user.steamid + ';persist=true'});
            response.end();
        } catch (error) {
            console.error(error);
        }
    } else if (url.startsWith('/sig?id=')) {
        const steamId = url.split('id=')[1];
        const statsArray = await query(queries.getExpAndLevel, [steamId]);

        if (statsArray.length > 0) {
            const expAndLevel = statsArray[0];
            const stats = {
                exp: expAndLevel.exp,
                level: expAndLevel.level,
                percentageOfLevelCompleted: getPercentageOfLevelCompleted(expAndLevel),
                imageCurrentLevel: imageForLevel[Math.min(Math.ceil(expAndLevel.level / 3) - 1, imageForLevel.length - 1)],
                imageNextLevel: imageForLevel[Math.min(Math.ceil(expAndLevel.level / 3), imageForLevel.length - 1)]
            };
            await createSigImage(stats, response);
        } else {
            response.end(JSON.stringify('not found'), 'utf-8');
        }
    } else if (url.startsWith('/sig2?id=')) {
        const steamId = url.split('id=')[1];
        const statsArray = await query(queries.getSig2, [steamId]);

        if (statsArray.length > 0) {
            const stats = statsArray[0];
            await createSig2Image(stats, response);
        } else {
            response.end(JSON.stringify('not found'), 'utf-8');
        }
    } else if (url.startsWith('/api/')) {
        if (url === '/api/lobbies/rooms-info') {
            const rooms = await query(queries.rooms);
            response.end(JSON.stringify(rooms), 'utf-8');
        } else if (url === '/api/allnames') {
            const allNames = await query(queries.getAllNames);
            response.end(JSON.stringify(allNames), 'utf-8');
        } else if (url === '/api/stats/top100') {
            const top100 = await query(queries.top100);
            response.end(JSON.stringify(top100), 'utf-8');
        } else if (url.startsWith('/api/weektop')) {
            let limit = 1;
            if (url.split('limit=').length > 1) {
                limit = +url.split('limit=')[1] || limit;
            }

            const msInHour = 3600000;
            const msInWeek = msInHour * 24 * 7;
            const now = new Date();
            const startOfWeekDate = now - (((now.getDay() || 7) - 1) * 24 * msInHour); // set to monday
            const startOfWeekDateTime = startOfWeekDate - (startOfWeekDate % (24 * msInHour)); // set to 00:00

            const weekTops = [];
            weekTops.push({
                start: startOfWeekDateTime,
                end: now.getTime(),
                result: await query(queries.topPlayers7Days, [startOfWeekDateTime, now.getTime()])
            });
            for (let i = 0; i < limit - 1; i++) {
                const start = startOfWeekDateTime - (msInWeek * (i + 1));
                const end = startOfWeekDateTime - (msInWeek * i);
                weekTops.push({
                    start,
                    end,
                    result: await query(queries.topPlayers7Days, [start, end])
                });
            }

            response.end(JSON.stringify(weekTops), 'utf-8');
        } else if (url.startsWith('/api/steam/data')) {
            const steamId = url.split('id=')[1];
            if (steamId in steamDataCache) {
                response.end(steamDataCache[steamId], 'utf-8');
            } else {
                http.get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=&steamids=' + steamId, res => {
                    res.setEncoding('utf-8');
                    let rawData = '';
                    res.on('data', chunk => rawData += chunk);
                    res.on('end', () => {
                        steamDataCache[steamId] = JSON.stringify(rawData);
                        response.end(steamDataCache[steamId], 'utf-8')
                    });
                });
            }
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
        } else if (url.startsWith('/api/stats/individual/expandlevel?id=')) {
            const steamId = url.split('id=')[1];
            const stats = await query(queries.getExpAndLevel, [steamId]);
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

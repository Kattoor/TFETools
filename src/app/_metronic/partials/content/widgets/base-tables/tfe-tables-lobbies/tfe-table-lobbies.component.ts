import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {flatMap, map} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';

interface ApiResult {
    result: string;
    message: string;
    data: {
        onlineplayers: number;
        rooms: Lobby[];
    };
}

interface Player {
    pid: string;
    displayName: string;
}

interface Lobby {
    roomID: string;
    dsc: string;
    gameMode: number;
    region: string;
    sessionType: string;
    map: string;
    roomName: string;
    steamSession: string;
    bSaveChatLog: boolean;
    bEnableWordCensorship: boolean;
    bAllowSpectator: boolean;
    maxScore: number;
    pspTakingTime: number;
    goalTakenTime: number;
    blueTeam: Player[];
    redTeam: Player[];
    blackList: Player[];
    mapRotation: string[];
    maxPlayer: number;
    warmupTime: number;
    injuryTime: number;
    timeBetweenMatches: number;
    spawnProtectionTime: number;
    gameLength: number;
    numOfBots: number;

    totalAmountOfPlayers: number;
    percentageFilled: number;
    steamStartUrl: string;
    countryFlag: Observable<string>;
}

interface SteamResponse {
    response: {
        servers: { addr: string, steamid: string }[]
    };
}

interface FlagsApiResponse {
    ip: string;
    type: string;
    continent_code: string;
    continent_name: string;
    country_code: string;
    country_name: string;
    region_code: string;
    region_name: string;
    city: string;
    zip: string;
    latitude: number;
    longitude: number;
    location: {
        geoname_id: number;
        capital: string;
        languages: {
            code: string;
            name: string;
            native: string;
        }[];
        country_flag: string;
        country_flag_emoji: string;
        country_flag_emoji_unicode: string;
        calling_code: string;
        is_eu: boolean;
    };
}

@Component({
    selector: 'app-tfe-table-lobbies',
    templateUrl: './tfe-table-lobbies.component.html',
})
export class TfeTableLobbiesComponent implements OnInit {

    @Input() cssClass: string;

    lobbies$: Observable<Lobby[]>;
    totalAmountOfPlayers$: Observable<number>;

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {

    }

    ngOnInit(): void {
        const lobbies$ = this.http.get<ApiResult>('/api/lobbies/rooms-info')
            .pipe(map(apiResult => apiResult.data.rooms));

        this.lobbies$ = lobbies$
            .pipe(
                map(lobbies => {
                    lobbies = lobbies.map(lobby =>
                        Object.assign({}, lobby,
                            {
                                totalAmountOfPlayers: lobby.blueTeam.length + lobby.redTeam.length,
                                percentageFilled: (lobby.blueTeam.length + lobby.redTeam.length) / lobby.maxPlayer * 100,
                                steamStartUrl: this.sanitizer.bypassSecurityTrustUrl('steam://run/1148810/' + lobby.roomID),
                                countryFlag: this.getServerIpBySteamId(lobby.steamSession.split('.')[1])
                            }));
                    lobbies.sort((lobby1, lobby2) => lobby2.totalAmountOfPlayers - lobby1.totalAmountOfPlayers);
                    return lobbies;
                }));

        this.totalAmountOfPlayers$ = lobbies$
            .pipe(
                map(lobbies =>
                    lobbies
                        .map(lobby => lobby.blueTeam.length + lobby.redTeam.length)
                        .reduce((sum, x) => sum + x)));
    }

    getServerIpBySteamId(steamId: string): Observable<string> {
        const steamUrl = '/api/steam/GetServerIPsBySteamID?id=' + steamId;
        return this.http.get<SteamResponse>(steamUrl)
            .pipe(
                flatMap(steamResponse => {
                    const ip = steamResponse.response.servers[0].addr.split(':')[0];
                    const flagsApiUrl = '/api/flags?ip=' + ip;
                    return this.http.get<FlagsApiResponse>(flagsApiUrl)
                        .pipe(
                            map(flagsApiResponse => {
                                return 'https://www.countryflags.io/' + flagsApiResponse.country_code + '/flat/64.png';
                            }));
                }));
    }
}

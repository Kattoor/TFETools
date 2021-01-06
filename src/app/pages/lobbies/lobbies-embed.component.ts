import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {map} from 'rxjs/operators';

interface Player {
    pid: string;
    displayName: string;
}

interface Lobby {
    dsc: string;
    map: string;
    roomName: string;
    blueTeam: Player[];
    redTeam: Player[];
    mapRotation: string[];
    maxPlayer: number;
    totalAmountOfPlayers: number;
    percentageFilled: number;
    steamStartUrl: string;
    country: string;
    gameModeString: string;
}

@Component({
    selector: 'app-lobbies-embed',
    templateUrl: './lobbies-embed.component.html'
})
export class LobbiesEmbedComponent implements OnInit {

    lobbies$: Observable<Lobby[]>;
    totalAmountOfPlayers$: Observable<number>;

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {

    }

    ngOnInit(): void {
        this.lobbies$ = this.http.get<Lobby[]>('/api/lobbies/rooms-info').pipe(map(lobbies => {
            lobbies = lobbies.map(lobby =>
                Object.assign(lobby, {steamStartUrl: this.sanitizer.bypassSecurityTrustUrl(lobby.steamStartUrl)}));
            lobbies.sort((l1, l2) => l2.totalAmountOfPlayers - l1.totalAmountOfPlayers);
            return lobbies;
        }));

        this.totalAmountOfPlayers$ = this.lobbies$
            .pipe(
                map(lobbies =>
                    lobbies
                        .map(lobby => lobby.totalAmountOfPlayers)
                        .reduce((sum, x) => sum + x)));
    }
}

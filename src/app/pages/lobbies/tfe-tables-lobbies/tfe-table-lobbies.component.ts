import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {flatMap, map} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';

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
    selector: 'app-tfe-table-lobbies',
    templateUrl: './tfe-table-lobbies.component.html',
    styleUrls: ['./tfe-table-lobbies.component.css']
})
export class TfeTableLobbiesComponent implements OnInit {

    @Input() cssClass: string;

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

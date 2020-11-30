import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

interface KillsDeathsResult {
    kills: number;
    deaths: number;
    ratio: number;
    date: number;
}

interface ActivityResult {
    level: number;
    plays: number;
    wins: number;
    draws: number;
    kills: number;
    date: number;
}

interface HeadshotsResult {
    kills: number;
    heads: number;
    ratio: number;
    date: number;
}

interface GameWinsLossesDrawsResult {
    wins: number;
    losses: number;
    draws: number;
    date: number;
}

interface TkothZoneTimerResult {
    timeInZone: number;
    date: number;
}

interface DisplayName {
    displayName: string;
}

@Component({
    selector: 'app-individual-stats',
    templateUrl: './individual-stats.component.html'
})
export class IndividualStatsComponent implements OnInit {

    hasParams = false;

    name$: Observable<DisplayName[]>;
    killsDeaths$: Observable<KillsDeathsResult[]>;
    activity$: Observable<ActivityResult[]>;
    headshots$: Observable<HeadshotsResult[]>;
    gameWinsLossesDraws$: Observable<GameWinsLossesDrawsResult[]>;
    tkothZoneTimer$: Observable<TkothZoneTimerResult[]>;

    constructor(private route: ActivatedRoute, private http: HttpClient) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params.id === undefined) {
                this.hasParams = false;
            } else {
                this.hasParams = true;

                this.name$ = this.http.get<DisplayName[]>('/api/stats/individual/displayname?id=' + params.id);

                this.killsDeaths$ = this.http.get<KillsDeathsResult[]>('/api/stats/individual/killsdeaths?id=' + params.id);

                this.activity$ = this.http.get<ActivityResult[]>('/api/stats/individual/activity?id=' + params.id);

                this.headshots$ = this.http.get<HeadshotsResult[]>('/api/stats/individual/headshots?id=' + params.id);

                this.gameWinsLossesDraws$ = this.http.get<GameWinsLossesDrawsResult[]>('/api/stats/individual/gamewinslossesdraws?id=' + params.id);

                this.tkothZoneTimer$ = this.http.get<TkothZoneTimerResult[]>('/api/stats/individual/tkothzonetimer?id=' + params.id);
            }
        });
    }
}

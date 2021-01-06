import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

export interface Stats {
    _id: string;
    kills: number;
    wins: number;
    plays: number;
    draws: number;
    heads: number;
    deaths: number;
    points: number;
    knifeKills: number;
    pspTaken: number;
    timeInZone: number;
    sniperKills: number;
    revivals: number;
    heals: number;
    flagsTaken: number;
    flagsTaking: number;
    displayName: string;
    exp: number;
    level: number;

    kdRatio: number;
    headshotPercentage: number;
    position: number;
    currentRank: number;
    previousRank: number;
}

@Component({
    selector: 'app-top100-stats',
    templateUrl: './top100-stats.component.html'
})
export class Top100StatsComponent implements OnInit {

    top100Stats$: Observable<Stats[]>;

    constructor(private http: HttpClient) {
        this.top100Stats$ =
            this.http.get<Stats[]>('/api/stats/top100')
                .pipe(map(apiResult => apiResult
                    .map((stats, index) => Object.assign({}, stats, {
                        position: index + 1,
                        kdRatio: Math.round(stats.kills / stats.deaths * 100) / 100,
                        headshotPercentage: Math.round(stats.heads / stats.kills * 10 * 100) / 10
                    }))));
    }

    ngOnInit(): void {
    }

}

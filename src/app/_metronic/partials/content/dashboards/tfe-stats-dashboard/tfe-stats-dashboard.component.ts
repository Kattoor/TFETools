import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResult {
  result: string;
  message: string;
  data: {
    players: Player[]
  };
}

interface Player {
  data: Stats;
  result: boolean;
  message: string;
}

interface Stats {
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
}

@Component({
  selector: 'app-tfe-stats-dashboard',
  templateUrl: './tfe-stats-dashboard.component.html',
})
export class TfeStatsDashboardComponent implements OnInit {

  stats$: Observable<Stats>;

  constructor(private http: HttpClient) {
    const observablePlayers: Observable<Player[]> = this.http.get<ApiResult>('api/stats').pipe(map(apiResult => apiResult.data.players));
    this.stats$ = observablePlayers.pipe(map(players => players[0].data));
  }

  ngOnInit(): void {}
}

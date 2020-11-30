import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { LobbiesTable } from './fake-db/lobbies.table';
import {StatsTable} from './fake-db/stats.table';
import {Top100StatsTable} from './fake-db/top-100-stats.table';

@Injectable({
  providedIn: 'root',
})
export class FakeAPIService implements InMemoryDbService {
  constructor() { }

  /**
   * Create Fake DB and API
   */
  createDb(): {} | Observable<{}> {
    // tslint:disable-next-line:class-name
    const db = {
      lobbies: LobbiesTable.lobbies,
      stats: StatsTable.stats,
      top100Stats: Top100StatsTable.top100Stats
    };
    return db;
  }
}

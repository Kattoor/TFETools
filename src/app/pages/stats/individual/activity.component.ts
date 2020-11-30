import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {combineLatest, map} from 'rxjs/operators';

interface ActivityResult {
    level: number;
    plays: number;
    wins: number;
    draws: number;
    kills: number;
    date: string;
}

interface ActivityResultToDisplay {
    activity: string;
    date: string;
    killsDiff?: number;
}

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

    @Input() stats$: Observable<ActivityResult[]>;

    activities$: Observable<ActivityResultToDisplay[]>;

    constructor() {
    }

    ngOnInit(): void {
        this.activities$ = this.stats$.pipe(
            map((activityResults: ActivityResult[]) => {
                const toReturn = activityResults
                    .map((activityResult: ActivityResult, index: number) => {
                        if (index === 0) {
                            return null;
                        }

                        let activity: string;
                        if (activityResult.wins > activityResults[index - 1].wins) {
                            activity = 'win';
                        } else if (activityResult.draws > activityResults[index - 1].draws) {
                            activity = 'draw';
                        } else {
                            activity = 'loss';
                        }

                        return {
                            activity,
                            date: activityResult.date,
                            killsDiff: activityResult.kills - activityResults[index - 1].kills,
                        };
                    })
                    .filter(result => result !== null);

                toReturn.sort((r1, r2) => r2.date.localeCompare(r1.date));

                return toReturn;
            }));
        /*this.activities$ = this.stats$.pipe(map(statsArray => {
            let previousStats = statsArray[0];
            const activities = [];

            statsArray.slice(1).forEach(stats => {
                let changed = false;

                /!* if (stats.kills !== previousStats.kills) {
                     changed = true;
                     activities.push({activity: 'kills', diff: previousStats.kills - stats.kills, date: stats.date});
                 }

                 if (stats.deaths !== previousStats.deaths) {
                     changed = true;
                     activities.push({activity: 'deaths', diff: previousStats.deaths - stats.deaths, date: stats.date});
                 }*!/

                if (stats.wins !== previousStats.wins) {
                    changed = true;
                    activities.push({
                        activity: 'wins',
                        diff: previousStats.wins - stats.wins,
                        date: stats.date,
                        killsDiff: stats.kills - previousStats.kills
                    });
                }

                if (stats.losses !== previousStats.losses) {
                    changed = true;
                    activities.push({activity: 'losses', diff: previousStats.losses - stats.losses, date: stats.date});
                }

                if (stats.draws !== previousStats.draws) {
                    changed = true;
                    activities.push({activity: 'draws', diff: previousStats.draws - stats.draws, date: stats.date});
                }

                /!*    if (stats.timeInZone !== previousStats.timeInZone) {
                        changed = true;
                        activities.push({
                            activity: 'timeInZone',
                            diff: previousStats.timeInZone - stats.timeInZone,
                            date: stats.date
                        });
                    }*!/

                if (changed) {
                    previousStats = stats;
                }
            });

            activities.sort((d1, d2) => d2.date - d1.date);

            return activities;
        }));*/
    }
}

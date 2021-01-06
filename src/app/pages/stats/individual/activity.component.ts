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

                return toReturn.slice(0, 33);
            }));
    }
}

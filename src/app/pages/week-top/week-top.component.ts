import {Component, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {flatMap, map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

interface WeekTopResult {
    start: number;
    end: number;
    result: CategoryResult[];

    date: Date;
}

interface CategoryResult {
    _id: string;
    displayName: string;
    value: number;
    plays: number;
    type: string;
    rn: string;

    steamAvatarUrl: string;
}


interface WeekRecord {
    date: Date;
    categories: {
        ids: string[];
        users: string[];
        values: number[];
        plays: number[];
        steamAvatarUrl: string;
        type: string;
        typeLabel?: string;
        valueLabel?: string;
    }[];
}

interface GroupedUsers {
    year: number;
    months: {
        month: number;
        weekRecords: WeekRecord[];
    }[];
}

@Component({
    selector: 'app-week-top',
    templateUrl: './week-top.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./week-top.component.scss']
})
export class WeekTopComponent {

    topUsers$: Observable<GroupedUsers[]>;
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    constructor(private http: HttpClient) {
        const weekTopResults$: Observable<WeekTopResult[]> =
            this.http.get<WeekTopResult[]>('/api/weektop?limit=6').pipe(
                flatMap(weekTopResults => {

                    /* Step 1: WeekTopResult[] to Observable<WeekTopResult>[] */
                    const listOfObservablesContainingWeekTopResultsWithImageUrlsForTheirCategories: Observable<WeekTopResult>[] = [];
                    weekTopResults.forEach(weekTopResult => {

                        /* Step 1.1: WeekTopResult to Observable<CategoryResult>[] */
                        const listOfObservablesContainingCategoryResultsWithImageUrl: Observable<CategoryResult>[] = [];
                        weekTopResult.result.forEach(categoryResult => {
                            const categoryResultWithImageUrl$: Observable<CategoryResult> =
                                categoryResult.rn === '1'
                                    ? this.http.get<any>('/api/steam/data?id=' + categoryResult._id)
                                        .pipe(
                                            map(result => JSON.parse(result).response.players[0].avatarfull),
                                            map(imageUrl => Object.assign({}, categoryResult, {steamAvatarUrl: imageUrl})))
                                    : new Observable(subscriber => {
                                        subscriber.next(categoryResult);
                                        subscriber.complete();
                                    });

                            listOfObservablesContainingCategoryResultsWithImageUrl.push(categoryResultWithImageUrl$);
                        });

                        /* Step 1.2: Observable<CategoryResult>[] to Observable<CategoryResult[]> */
                        const observableOfListContainingCategoryResultsWithImageUrl =
                            forkJoin(listOfObservablesContainingCategoryResultsWithImageUrl);

                        /* Step 1.3: Observable<CategoryResult[]> to Observable<WeekTopResult> */
                        const observableOfWeekTopResultsWithImageUrlsForEachCategory: Observable<WeekTopResult> =
                            observableOfListContainingCategoryResultsWithImageUrl.pipe(
                                map(listContainingCategoryResultsWithImageUrl => Object.assign({}, {
                                    start: weekTopResult.start,
                                    end: weekTopResult.end,
                                    result: listContainingCategoryResultsWithImageUrl,
                                    date: new Date(weekTopResult.start)
                                })));

                        listOfObservablesContainingWeekTopResultsWithImageUrlsForTheirCategories
                            .push(observableOfWeekTopResultsWithImageUrlsForEachCategory);
                    });

                    /* Step 2: Observable<WeekTopResult>[] to Observable<WeekTopResult[]> */
                    return forkJoin(listOfObservablesContainingWeekTopResultsWithImageUrlsForTheirCategories);
                })
            );

        this.topUsers$ = weekTopResults$.pipe(map(weekTopResults => {
            const collection: GroupedUsers[] = [];

            weekTopResults.forEach(weekTopResult => {
                const year = weekTopResult.date.getFullYear();
                const month = weekTopResult.date.getMonth();

                let yearArrayIndex = collection.findIndex(r => r.year === year);
                if (yearArrayIndex === -1) {
                    yearArrayIndex = collection.push({year, months: []}) - 1;
                }
                let monthArrayIndex = collection[yearArrayIndex].months.findIndex(r => r.month === month);
                if (monthArrayIndex === -1) {
                    monthArrayIndex = collection[yearArrayIndex].months.push({month, weekRecords: []}) - 1;
                }

                const categoryResultGroupedByType = weekTopResult.result
                    .reduce((collector: { type: string, results: CategoryResult[] }[], current: CategoryResult) => {
                        const index = collector.findIndex(collected => collected.type === current.type);
                        if (index === -1) {
                            collector.push({type: current.type, results: [current]});
                        } else {
                            collector[index].results.push(current);
                        }
                        return collector;
                    }, []);
                categoryResultGroupedByType.forEach(categoryResultGroup =>
                    categoryResultGroup.results.sort((cr1, cr2) => +cr1.rn - +cr2.rn));

                collection[yearArrayIndex].months[monthArrayIndex].weekRecords.push({
                    date: weekTopResult.date,
                    categories: categoryResultGroupedByType
                        .map(categoryResultGroup => Object.assign({}, {
                            ids: categoryResultGroup.results.map(result => result._id),
                            users: categoryResultGroup.results.map(result => result.displayName),
                            values: categoryResultGroup.results.map(result => result.value),
                            plays: categoryResultGroup.results.map(result => result.plays),
                            steamAvatarUrl: categoryResultGroup.results
                                .filter(result => result.rn === '1')
                                .map(result => result.steamAvatarUrl)[0],
                            type: categoryResultGroup.type
                        }))
                });
            });

            /* Sorting */
            /* Year: DESC, month: DESC, week: DESC */
            collection.sort((r1, r2) => r2.year - r1.year);
            collection.forEach(yearRecord => yearRecord.months.sort((m1, m2) => m2.month - m1.month));
            collection.forEach(yearRecord => yearRecord.months.forEach(monthRecord =>
                monthRecord.weekRecords.sort((u1, u2) => u2.date.getTime() - u1.date.getTime())));

            /* Sort categories and append value label */
            const categories = {
                winner: {position: 0, valueLabel: 'wins', typeLabel: 'game winner'},
                killer: {position: 1, valueLabel: 'kills', typeLabel: 'killer'},
                zoner: {position: 2, valueLabel: '(s)', typeLabel: 'zone camper'},
                sniper: {position: 3, valueLabel: 'kills', typeLabel: 'sniper'},
                medic: {position: 4, valueLabel: 'meds', typeLabel: 'medic'}
            };
            collection.forEach(yearRecord => yearRecord.months.forEach(monthRecord =>
                monthRecord.weekRecords.forEach(weekRecord => {
                    weekRecord.categories.sort((c1, c2) =>
                        categories[c1.type].position - categories[c2.type].position);
                    weekRecord.categories.forEach(category => {
                        category.valueLabel = categories[category.type].valueLabel;
                        category.typeLabel = categories[category.type].typeLabel;
                    });
                })));

            return collection;
        }));
    }
}

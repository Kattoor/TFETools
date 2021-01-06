import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {combineLatest, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Stats} from './top100-stats.component';

export interface CheckableColumn {
    columnName: string;
    checked: boolean;
    text: string;
    backgroundColor?: string;
    textRight?: boolean;
    notSortable?: boolean;
    isLabel?: boolean;
    dangerThreshold?: number;
}

@Component({
    selector: 'app-tfe-tables-top100-stats',
    templateUrl: './tfe-tables-top100-stats.component.html',
    styleUrls: ['./tfe-tables-top100-stats.component.css'],
    encapsulation: ViewEncapsulation.None /* For tooltip style */
})
export class TfeTablesTop100StatsComponent implements OnInit {

    @Input() top100Stats$: Observable<Stats[]>;
    sortedTop100Stats$: Observable<Stats[]>;
    columns: CheckableColumn[] = [
        {columnName: 'position', checked: true, text: '', textRight: true, notSortable: true},
        {columnName: 'displayName', checked: true, text: 'Name'},
        {columnName: 'exp', checked: true, text: 'Experience', textRight: true},
        {columnName: 'level', checked: false, text: 'Level', textRight: true},
        {columnName: 'kills', checked: true, text: 'Kills', backgroundColor: '#F3F6F9', textRight: true},
        {columnName: 'deaths', checked: true, text: 'Deaths', backgroundColor: '#F3F6F9', textRight: true},
        {
            columnName: 'kdRatio',
            checked: true,
            text: 'KD Ratio',
            backgroundColor: '#F3F6F9',
            textRight: true,
            isLabel: true,
            dangerThreshold: 1
        },
        {columnName: 'wins', checked: false, text: 'Wins', textRight: true},
        {columnName: 'plays', checked: false, text: 'Plays', textRight: true},
        {columnName: 'draws', checked: false, text: 'Draws', textRight: true},
        {columnName: 'heads', checked: true, text: 'Heads', textRight: true},
        {columnName: 'headshotPercentage', checked: true, text: 'HS Percentage', textRight: true},
        {columnName: 'points', checked: false, text: 'Points', textRight: true},
        {columnName: 'sniperKills', checked: false, text: 'Sniper Kills', backgroundColor: '#F3F6F9', textRight: true},
        {columnName: 'knifeKills', checked: false, text: 'Knife Kills', backgroundColor: '#F3F6F9', textRight: true},
        {columnName: 'timeInZone', checked: false, text: 'Time In Zone', backgroundColor: '#F3F6F9', textRight: true},
        {columnName: 'pspTaken', checked: false, text: 'Psp Taken', textRight: true},
        {columnName: 'revivals', checked: false, text: 'Revivals', textRight: true},
        {columnName: 'heals', checked: false, text: 'Heals', textRight: true},
        {columnName: 'flagsTaken', checked: false, text: 'Flags Taken', textRight: true},
        {columnName: 'flagsTaking', checked: false, text: 'Flags Taking', textRight: true}
    ];

    sorting$ = new BehaviorSubject<{ property: string, order: string }>({property: 'exp', order: 'DSC'});

    constructor(private router: Router) {

    }

    ngOnInit(): void {
        this.sortedTop100Stats$ =
            this.top100Stats$
                .pipe(
                    combineLatest(this.sorting$),
                    map(([top100Stats, sorting]) => {
                        top100Stats.sort((s1, s2) => {
                            if (typeof s1[sorting.property] === 'string') {
                                if (sorting.order === 'ASC') {
                                    return s1[sorting.property] < s2[sorting.property] ? -1 : 1;
                                } else {
                                    return s1[sorting.property] < s2[sorting.property] ? 1 : -1;
                                }
                            } else {
                                if (sorting.order === 'ASC') {
                                    return s1[sorting.property] - s2[sorting.property];
                                } else {
                                    return s2[sorting.property] - s1[sorting.property];
                                }
                            }
                        });

                        return top100Stats.map((stats, index) => Object.assign({}, stats, {position: index + 1}));
                    }));
    }

    headerClicked(propertyName: string): void {
        if (this.sorting$.getValue().property === propertyName) {
            this.sorting$.next({
                property: this.sorting$.getValue().property,
                order: this.sorting$.getValue().order === 'ASC' ? 'DSC' : 'ASC'
            });
        } else {
            this.sorting$.next({property: propertyName, order: 'DSC'});
        }
    }

    setHeaderTextClasses(propertyName: string): string {
        return this.sorting$.getValue().property === propertyName ? 'text-dark-75' : '';
    }

    setIconClasses(propertyName: string): string {
        return 'svg-icon svg-icon-sm svg-icon-primary mr-1 svg-filter-icon ' + (this.sorting$.getValue().property === propertyName ? 'filter-icon-active' : 'filter-icon-inactive');
    }

    getSvg(): string {
        return './assets/media/svg/icons/Shopping/' + (this.sorting$.getValue().order === 'ASC' ? 'Sort3' : 'Sort2') + '.svg';
    }

    async loadIndividualUser(steamId: string) {
        await this.router.navigate(['stats/individual', {id: steamId}]);
    }

    setRankUpdateClass(stats: Stats) {
        const delta = stats.currentRank - stats.previousRank;
        if (delta > 1) {
            return 'ki-double-arrow-down text-danger';
        } else if (delta === 1) {
            return 'ki-arrow-down text-danger';
        } else if (delta === 0) {
            return 'ki-minus text-primary';
        } else if (delta === -1) {
            return 'ki-arrow-up text-success';
        } else {
            return 'ki-double-arrow-up text-success';
        }
    }
}

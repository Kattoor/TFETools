import {Component, Input, OnInit} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {map, combineLatest, filter, flatMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {NameAndId} from './individual-history.component';

interface KillsDeathsResult {
    kills: number;
    deaths: number;
    ratio: number;
    date: number;
}

@Component({
    selector: 'app-kd-chart',
    templateUrl: './kd-chart.component.html'
})
export class KdChartComponent implements OnInit {

    @Input() id$: Observable<number>;
    @Input() compareUser$: Observable<NameAndId>;

    @Input() stats$: Observable<KillsDeathsResult[]>;
    @Input() compareStats$: Observable<KillsDeathsResult[]>;

    chartOptions$: Observable<any>;

    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
        this.chartOptions$ = this.id$
            .pipe(
                filter(id => id !== null),
                combineLatest(this.compareUser$),
                flatMap(([id, compareUser]) =>
                    forkJoin({
                        user: this.http.get<KillsDeathsResult[]>('/api/stats/individual/killsdeaths?id=' + id),
                        compareUser: compareUser
                            ? this.http.get<KillsDeathsResult[]>('/api/stats/individual/killsdeaths?id=' + compareUser._id)
                            : of(null),
                        compareUsername: of(compareUser?.displayName)
                    })
                ),
                map(data => this.getChartOptions(data)));
    }

    syncDataPoints(data) {
        data.user = data.user.map(u => {
            u.date = +u.date;
            return u;
        });

        data.compareUser = data.compareUser.map(u => {
            u.date = +u.date;
            return u;
        });

        const userTimePoints = data.user.map(user => user.date);
        const compareUserTimePoints = data.compareUser.map(user => user.date);
        const allTimePoints: number[] = userTimePoints.concat(compareUserTimePoints);

        const missingInUser = allTimePoints.filter(timePoint => !userTimePoints.find(userTimePoint => timePoint === userTimePoint));
        const missingInCompareUser = allTimePoints.filter(timePoint => !compareUserTimePoints.find(userTimePoint => timePoint === userTimePoint));

        missingInUser.forEach(missingTimePoint => {
            const value = data.user.reduce((result, current) => current.date < missingTimePoint ? current : result, data.user[0]);
            data.user.push(Object.assign({}, value, {date: missingTimePoint}));
            data.user.sort((u1, u2) => u1.date - u2.date);
            /*todo: push to correct index instead of sorting whole array every iteration*/
        });

        missingInCompareUser.forEach(missingTimePoint => {
            const value = data.compareUser.reduce((result, current) =>
                current.date < missingTimePoint ? current : result, data.compareUser[0]);

            data.compareUser.push(Object.assign({}, value, {date: missingTimePoint}));
            data.compareUser.sort((u1, u2) => u1.date - u2.date);
            /*todo: push to correct index instead of sorting whole array every iteration*/
        });
    }

    getChartOptions(data: { user: KillsDeathsResult[], compareUser: KillsDeathsResult[], compareUsername: string }) {
        if (data.compareUser) {
            this.syncDataPoints(data);
        }

        return {
            series: [
                {name: 'Kills', type: 'line', data: data.user.map(record => ({x: +record.date, y: record.kills}))},
                {name: 'Deaths', type: 'line', data: data.user.map(record => ({x: +record.date, y: record.deaths}))},
            ].concat(data.compareUser ? [
                {
                    name: 'Kills (' + data.compareUsername + ')',
                    type: 'line',
                    data: data.compareUser.map(record => ({x: +record.date, y: record.kills}))
                },
                {
                    name: 'Deaths (' + data.compareUsername + ')',
                    type: 'line',
                    data: data.compareUser.map(record => ({x: +record.date, y: record.deaths}))
                },
            ] : []),
            colors: ['#1BC5BD', '#F64E60'],
            chart: {
                height: 350,
                animations: {enabled: false},
                toolbar: {
                    show: true,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                    },
                }
            },
            stroke: {
                curve: 'stepline',
                width: 1,
                dashArray: [0, 0, 10, 10]
            },
            grid: {
                borderColor: 'rgba(0, 0, 0, .4)',
                row: {
                    colors: ['rgba(0, 0, 0, .3)', 'rgba(0, 0, 0, 0)'],
                }
            },
            xaxis: {
                type: 'datetime',
                tooltip: {
                    enabled: false,
                    offsetX: 0,
                }
            },
            yaxis: [
                {
                    axisTicks: {
                        show: false,
                    }
                }
            ],
            tooltip: {
                shared: true,
                x: {
                    format: 'dd MMM - HH:mm'
                },
                theme: 'dark'
            }
        };
    }
}

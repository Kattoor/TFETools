import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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

    @Input() stats$: Observable<KillsDeathsResult[]>;

    chartOptions$: Observable<any>;

    constructor() {
    }

    ngOnInit(): void {
        this.chartOptions$ = this.stats$.pipe(
            map(data => this.getChartOptions(data)));
    }

    getChartOptions(data: KillsDeathsResult[]) {
        return {
            series: [
                {name: 'Kills', type: 'line', data: data.map(record => ({x: +record.date, y: record.kills}))},
                {name: 'Deaths', type: 'line', data: data.map(record => ({x: +record.date, y: record.deaths}))}
            ],
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
            stroke: {curve: 'smooth', width: 1},
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

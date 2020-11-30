import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface TkothZoneTimerResult {
    timeInZone: number;
    date: number;
}

@Component({
    selector: 'app-zone-time-chart',
    templateUrl: './zone-time-chart.component.html'
})
export class ZoneTimeChartComponent implements OnInit {

    @Input() stats$: Observable<TkothZoneTimerResult[]>;

    chartOptions$: Observable<any>;

    constructor() {
    }

    ngOnInit(): void {
        this.chartOptions$ = this.stats$.pipe(
            map(data => this.getChartOptions(data)));
    }

    getChartOptions(data: TkothZoneTimerResult[]) {
        return {
            series: [
                {name: 'Time', type: 'line', data: data.map(record => ({x: +record.date, y: record.timeInZone}))},
            ],
            colors: ['#FFA800'],
            chart: {
                height: 350,
                animations: {enabled: false},
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                    },
                }
            },
            stroke: {curve: 'smooth'},
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                }
            },
            xaxis: {
                type: 'datetime'
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
                }
            }
        };
    }
}

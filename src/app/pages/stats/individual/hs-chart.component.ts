import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface HeadshotsResult {
    kills: number;
    heads: number;
    ratio: number;
    date: number;
}

@Component({
    selector: 'app-hs-chart',
    templateUrl: './hs-chart.component.html'
})
export class HsChartComponent implements OnInit {

    @Input() stats$: Observable<HeadshotsResult[]>;

    chartOptions$: Observable<any>;

    constructor() {
    }

    ngOnInit(): void {
        this.chartOptions$ = this.stats$.pipe(
            map(data => this.getChartOptions(data)));
    }

    getChartOptions(data: HeadshotsResult[]) {
        return {
            series: [
                {
                    name: 'Headshots',
                    type: 'area',
                    data: data.map(record => ({
                        x: +record.date,
                        y: record.ratio
                    }))
                }
            ],
            colors: ['#1BC5BD', '#F64E60'],
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
            yaxis: {
                axisTicks: {
                    show: false,
                },
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                    formatter: value => Math.round(value)
                }
            },
            tooltip: {
                shared: true,
                x: {
                    format: 'dd MMM - HH:mm'
                },
                y: {
                    formatter: (value, {series, seriesIndex, dataPointIndex, w}) => value + '% of ' + data[dataPointIndex].kills + ' kills',
                    title: {
                        formatter: (seriesName) => seriesName,
                    },
                }
            }
        };
    }
}

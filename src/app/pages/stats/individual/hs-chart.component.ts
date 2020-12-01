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
                    data: data.map(record => ({
                        x: +record.date,
                        y: record.ratio
                    }))
                }
            ],
            colors: ['#1BC5BD', '#F64E60'],
            chart: {
                type: 'area',
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
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 0,
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
            yaxis: {
                axisTicks: {
                    show: false,
                },
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
                },
                theme: 'dark'
            }
        };
    }
}

import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface GameWinsLossesDrawsResult {
    wins: number;
    losses: number;
    draws: number;
    date: number;
}

@Component({
    selector: 'app-wins-losses-draws-chart',
    templateUrl: './wins-losses-draws-chart.component.html'
})
export class WinsLossesDrawsChartComponent implements OnInit {

    @Input() stats$: Observable<GameWinsLossesDrawsResult[]>;

    chartOptions$: Observable<any>;

    constructor() {
    }

    ngOnInit(): void {
        this.chartOptions$ = this.stats$.pipe(
            map(data => this.getChartOptions(data)));
    }

    getChartOptions(data: GameWinsLossesDrawsResult[]) {
        return {
            series: [
                {name: 'Wins', data: data.map(record => ({x: +record.date, y: record.wins}))},
                {name: 'Losses', data: data.map(record => ({x: +record.date, y: record.losses}))},
                {name: 'Draws', data: data.map(record => ({x: +record.date, y: record.draws}))}
            ],
            colors: ['#1BC5BD', '#F64E60', '#FFA800'],
            chart: {
                type: 'area',
                stacked: false,
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
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 0,
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

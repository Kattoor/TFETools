import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LayoutService} from '../../../_metronic/core';

@Component({
    selector: 'app-individual-stats',
    templateUrl: './individual-stats.component.html'
})
export class IndividualStatsComponent implements OnInit {

    @Input() id$: Observable<string>;

    colorSuccess: string;
    colorWarning: string;
    colorDanger: string;
    chartOptions: any = {};

    constructor(private layout: LayoutService) {
        this.colorSuccess = this.layout.getProp('js.colors.theme.base.success');
        this.colorWarning = this.layout.getProp('js.colors.theme.base.warning');
        this.colorDanger = this.layout.getProp('js.colors.theme.base.danger');
    }

    ngOnInit(): void {
        this.chartOptions = this.getChartOptions();
    }

    getChartOptions() {
        return {
            series: [200, 75, 5],
            chart: {
                height: 350,
                type: 'donut'
            },
            stroke: {
                width: 0
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Plays'
                            },
                            name: {
                                show: true,
                            },
                            value: {
                                show: true,
                                formatter: (val, obj) => val + ' (' + Math.round((val / obj.config.series.reduce((a, b) => a + b) * 100)) + '%)'
                            }
                        }
                    }
                }
            },
            labels: ['Wins', 'Losses', 'Draws'],
            colors: [this.colorSuccess, this.colorDanger, this.colorWarning],
            legend: {show: false},
            tooltip: {enabled: false},
        };
    }
}

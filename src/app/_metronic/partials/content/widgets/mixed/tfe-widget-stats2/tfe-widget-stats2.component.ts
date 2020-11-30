import {Component, Input, OnInit} from '@angular/core';
import { LayoutService } from '../../../../../core';

@Component({
  selector: 'app-tfe-widget-stats2',
  templateUrl: './tfe-widget-stats2.component.html',
})
export class TfeWidgetStats2Component implements OnInit {

  @Input() kills: number;
  @Input() headshots: number;
  @Input() sniper: number;

  colorsGrayGray100: string;
  colorsGrayGray700: string;
  colorsThemeBaseSuccess: string;
  colorsThemeLightSuccess: string;
  fontFamily: string;
  chartOptions: any = {};

  constructor(private layout: LayoutService) {
    this.colorsGrayGray100 = this.layout.getProp('js.colors.gray.gray100');
    this.colorsGrayGray700 = this.layout.getProp('js.colors.gray.gray700');
    this.colorsThemeBaseSuccess = this.layout.getProp(
      'js.colors.theme.base.success'
    );
    this.colorsThemeLightSuccess = this.layout.getProp(
      'js.colors.theme.light.success'
    );
    this.fontFamily = this.layout.getProp('js.fontFamily');
  }

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();
  }

  getChartOptions() {
    return {
      series: [this.kills / this.kills * 100, this.headshots / this.kills * 100, this.sniper / this.kills * 100],
      chart: {
        height: 400,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ['#1ab7ea', '#0084ff', '#39539E'],
      labels: ['Kills', 'Headshots', 'Sniper'],
      legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: -25,
        offsetY: 20,
        labels: {
          useSeriesColors: true
        },
        formatter(seriesName, opts) {
          return seriesName + ':  ' + Math.round(opts.w.globals.series[opts.seriesIndex]) + '%';
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
  }
}

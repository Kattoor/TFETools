import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndividualStatsComponent} from './individual/individual-stats.component';
import {DashboardsModule} from '../../_metronic/partials/content/dashboards/dashboards.module';
import {StatsRoutingModule} from './stats-routing.module';
import {Top100StatsComponent} from './top100/top100-stats.component';
import {KdChartComponent} from './individual/kd-chart.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {HsChartComponent} from './individual/hs-chart.component';
import {IntroComponent} from './individual/intro.component';
import {ZoneTimeChartComponent} from './individual/zone-time-chart.component';
import {WinsLossesDrawsChartComponent} from './individual/wins-losses-draws-chart.component';
import {ActivityComponent} from './individual/activity.component';
import {TfeTablesTop100StatsComponent} from './top100/tfe-tables-top100-stats.component';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {TfeTablesTop100DropdownMenuComponent} from './top100/tfe-tables-top100-dropdown-menu.component';

@NgModule({
    declarations: [
        IndividualStatsComponent,
        Top100StatsComponent,
        KdChartComponent,
        HsChartComponent,
        IntroComponent,
        ZoneTimeChartComponent,
        WinsLossesDrawsChartComponent,
        ActivityComponent,
        TfeTablesTop100StatsComponent,
        TfeTablesTop100DropdownMenuComponent
    ],
    imports: [
        CommonModule,
        StatsRoutingModule,
        DashboardsModule,
        NgApexchartsModule,
        InlineSVGModule,
        NgbDropdownModule,
    ],
})
export class StatsModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Dashboard1Component} from './dashboard1/dashboard1.component';
import {Dashboard2Component} from './dashboard2/dashboard2.component';
import {Dashboard3Component} from './dashboard3/dashboard3.component';
import {TfeLobbiesDashboardComponent} from './tfe-lobbies-dashboard/tfe-lobbies-dashboard.component';
import {TfeStatsDashboardWrapperComponent} from './dashboard-wrappers/tfe-stats-dashboard-wrapper.component';
import {TfeLobbiesDashboardWrapperComponent} from './dashboard-wrappers/tfe-lobbies-dashboard-wrapper.component';
import {WidgetsModule} from '../widgets/widgets.module';
import {TfeStatsDashboardComponent} from './tfe-stats-dashboard/tfe-stats-dashboard.component';

@NgModule({
    declarations: [
        Dashboard1Component,
        Dashboard2Component,
        TfeStatsDashboardWrapperComponent,
        TfeLobbiesDashboardWrapperComponent,
        Dashboard3Component,
        TfeLobbiesDashboardComponent,
        TfeStatsDashboardComponent,
    ],
    imports: [CommonModule, WidgetsModule],
    exports: [TfeStatsDashboardWrapperComponent, TfeLobbiesDashboardWrapperComponent],
})
export class DashboardsModule {
}

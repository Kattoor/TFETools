import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WeekTopComponent} from './week-top.component';
import {WeekTopRoutingModule} from './week-top-routing.module';
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    declarations: [
        WeekTopComponent
    ],
    imports: [
        CommonModule,
        WeekTopRoutingModule,
        NgbTooltipModule
    ],
})
export class WeekTopModule {
}

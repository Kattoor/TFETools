import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LobbiesComponent } from './lobbies.component';
import { DashboardsModule } from '../../_metronic/partials/content/dashboards/dashboards.module';

@NgModule({
  declarations: [LobbiesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LobbiesComponent,
      },
    ]),
    DashboardsModule,
  ],
})
export class LobbiesModule {}

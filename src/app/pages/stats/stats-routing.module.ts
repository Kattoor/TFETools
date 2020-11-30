import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndividualStatsComponent } from './individual/individual-stats.component';
import { Top100StatsComponent } from './top100/top100-stats.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'individual',
        component: IndividualStatsComponent,
      },
      {
        path: 'top100',
        component: Top100StatsComponent,
      },
      {
        path: '',
        redirectTo: 'top100',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'errors/404',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsRoutingModule { }

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {Top100StatsComponent} from './top100/top100-stats.component';
import {IndividualComponent} from './individual/individual.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'individual',
                component: IndividualComponent,
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
export class StatsRoutingModule {
}

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './_layout/layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'lobbies',
                loadChildren: () =>
                    import('./lobbies/lobbies.module').then((m) => m.LobbiesModule)
            },
            {
                path: 'stats',
                loadChildren: () =>
                    import('./stats/stats.module').then((m) => m.StatsModule)
            },
            {
                path: 'week-top',
                loadChildren: () =>
                    import('./week-top/week-top.module').then((m) => m.WeekTopModule)
            },
            {
                path: '',
                redirectTo: 'lobbies',
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
export class PagesRoutingModule {
}

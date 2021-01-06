import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WeekTopComponent} from './week-top.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: WeekTopComponent,
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
export class WeekTopRoutingModule {
}

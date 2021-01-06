import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LobbiesComponent} from './lobbies.component';
import {LobbiesEmbedComponent} from './lobbies-embed.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LobbiesComponent,
            },
            {
                path: 'embed',
                component: LobbiesEmbedComponent,
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
export class LobbiesRoutingModule {
}

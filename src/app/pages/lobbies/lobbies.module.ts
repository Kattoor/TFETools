import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LobbiesComponent} from './lobbies.component';
import {LobbiesRoutingModule} from './lobbies-routing.module';
import {LobbiesEmbedComponent} from './lobbies-embed.component';
import {TfeTableLobbiesComponent} from './tfe-tables-lobbies/tfe-table-lobbies.component';
import {InlineSVGModule} from 'ng-inline-svg';
import {TfeTableLobbiesBodyComponent} from './tfe-tables-lobbies/tfe-table-lobbies-body.component';

@NgModule({
    declarations: [
        LobbiesComponent,
        LobbiesEmbedComponent,
        TfeTableLobbiesComponent,
        TfeTableLobbiesBodyComponent
    ],
    imports: [
        CommonModule,
        LobbiesRoutingModule,
        InlineSVGModule
    ],
})
export class LobbiesModule {
}

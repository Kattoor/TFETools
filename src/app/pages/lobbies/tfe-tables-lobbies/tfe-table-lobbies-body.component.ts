import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';

interface Player {
    pid: string;
    displayName: string;
}

interface Lobby {
    dsc: string;
    map: string;
    roomName: string;
    blueTeam: Player[];
    redTeam: Player[];
    mapRotation: string[];
    maxPlayer: number;
    totalAmountOfPlayers: number;
    percentageFilled: number;
    steamStartUrl: string;
    country: string;
    gameModeString: string;
}

@Component({
    selector: 'app-tfe-table-lobbies-body, [app-tfe-table-lobbies-body]',
    templateUrl: './tfe-table-lobbies-body.component.html',
    styleUrls: ['./tfe-table-lobbies-body.component.css']
})
export class TfeTableLobbiesBodyComponent {

    @Input() lobbies$: Observable<Lobby[]>;
    @Input() playerNamesRedirect = true;
    selectedLobbyIndex: number;

    getImage(mapName: string) {
        const data: { name: string, image: string, text: string }[] = [
            {name: 'RTE Airbase Redesigned', image: 'Airbase_Thumbnail', text: 'Abandoned Airbase'},
            {name: 'RTE Attack', image: 'BankCrash_Thumbnail', text: 'Bank Crash'},
            {name: 'RTE BaseCamp', image: 'BaseCamp_Thumbnail', text: 'Base Camp'},
            {name: 'RTE CQB Underground', image: 'CQB_Underground_Thumbnail', text: 'CQB Underground'},
            {name: 'RTE Raid', image: 'DD_Thumbnail', text: 'Raid'},
            {name: 'RTE DesertValley', image: 'DesertValley_Thumbnail', text: 'Desert Valley'},
            {name: 'RTE DowntownStrike', image: 'DS_Thumbnail', text: 'Downtown Strike'},
            {name: 'RTE DesertValley Sunset', image: 'DV_SunsetThumbnail', text: 'Desert Valley Sunset'},
            {name: 'RTE Firstfall June', image: 'FirstFall_Thumbnail', text: 'Firstfall'},
            {name: 'RTE Killingfields', image: 'Killingfield_Thumbnail', text: 'Killingfields'},
            {name: 'RTE MountainArena', image: 'MountainArena_Thumbnail', text: 'Mountain Arena'},
            {name: 'RTE NarcosDen v2', image: 'ND_Thumbnail', text: 'Narcos Den'},
            {name: 'RTE Pharaoh', image: 'Pharaoh_Thumbnail', text: 'Pharaoh'},
            {name: '?', image: 'Raid_Thumbnail', text: '?'},
            {name: 'SavannahRidge', image: 'SavannahRidge_Thumbnail', text: 'Savannah Ridge'},
            {name: 'RTE Shipyard V3', image: 'Shipyard_Thumbnail', text: 'Shipyard'},
            {name: 'RTE CQB Stronghold', image: 'StrongHold_Thumbnail', text: 'CQB Stronghold'},
            {name: 'RTE UnderSiege', image: 'Undersiege_Thumbnail', text: 'Under Siege'},
            {name: 'RTE CQB ValleyoftheDead', image: 'ValleyoftheDead_Thumbnail', text: 'CQB Valley of the Dead'},
            {name: 'RTE ViperNest', image: 'ViperNest_Thumbnail', text: 'Viper Nest'}
        ];

        return data.find(record => record.name === mapName);
    }

    openInfo(index: number) {
        if (this.selectedLobbyIndex === index) {
            this.selectedLobbyIndex = null;
        } else {
            this.selectedLobbyIndex = index;
        }
    }
}

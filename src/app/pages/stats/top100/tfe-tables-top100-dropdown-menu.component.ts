import {Component, Input, OnInit} from '@angular/core';
import {CheckableColumn} from './tfe-tables-top100-stats.component';

@Component({
    selector: 'app-tfe-tables-top100-dropdown-menu',
    templateUrl: './tfe-tables-top100-dropdown-menu.component.html',
})
export class TfeTablesTop100DropdownMenuComponent implements OnInit {

    @Input() columns: CheckableColumn[];

    constructor() {
    }

    ngOnInit(): void {
    }

    change(column: CheckableColumn) {
        column.checked = !column.checked;
    }
}

import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';

interface DisplayName {
    displayName: string;
}

@Component({
    selector: 'app-intro',
    templateUrl: './intro.component.html'
})
export class IntroComponent {

    @Input() stats$: Observable<DisplayName[]>;

    constructor() {
    }
}

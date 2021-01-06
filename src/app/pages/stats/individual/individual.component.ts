import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-individual',
    templateUrl: './individual.component.html'
})
export class IndividualComponent {

    hasParams = false;

    id$: BehaviorSubject<string> = new BehaviorSubject(null);

    selectedPage = 'charts';

    constructor(private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            if (params.id === undefined) {
                const steamIdFromLocalStorage = localStorage.getItem('steamId');
                if (steamIdFromLocalStorage) {
                    this.id$.next(steamIdFromLocalStorage);
                    this.hasParams = true;
                } else {
                    this.hasParams = false;
                }
            } else {
                this.id$.next(params.id);
                this.hasParams = true;

                if (params.persist) {
                    console.log(params.persist);
                    localStorage.setItem('steamId', params.id);
                }
            }
        });
    }
}

import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {flatMap} from 'rxjs/operators';

interface ActivityResult {
    level: number;
    plays: number;
    wins: number;
    draws: number;
    kills: number;
    date: number;
}

export interface NameAndId {
    _id: number;
    displayName: string;
}

@Component({
    selector: 'app-individual-history',
    templateUrl: './individual-history.component.html'
})
export class IndividualHistoryComponent implements OnInit {

    @Input() id$: Observable<string>;
    compareUser$: BehaviorSubject<NameAndId> = new BehaviorSubject(null);
    activity$: Observable<ActivityResult[]>;

    constructor(private route: ActivatedRoute, private http: HttpClient) {
    }

    ngOnInit(): void {
        this.activity$ = this.id$.pipe(flatMap(id => this.http.get<ActivityResult[]>('/api/stats/individual/activity?id=' + id)));
    }

    userToCompareSelected(compareUser: NameAndId) {
        this.compareUser$.next(compareUser);
    }
}

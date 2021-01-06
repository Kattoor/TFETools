import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {concat, Observable, of} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {filter, flatMap, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface DisplayName {
    displayName: string;
}

interface ExpAndLevel {
    exp: number;
    level: number;

    percentageOfLevelCompleted: number;
    imageCurrentLevel: string;
    imageNextLevel: string;
}

interface NameAndId {
    _id: number;
    displayName: string;
}

const expForLevel: number[] = [
    0, 500, 1500, 4000, 6000, 8000, 10000, 12000, 14000, 16000,
    18000, 21000, 24000, 27000, 30000, 33000, 36000, 39000, 42000, 45000,
    48000, 51000, 54000, 57000, 60000, 63000, 66000, 69000, 72000, 75000,
    79000, 83000, 87000, 91000, 95000, 99000, 103000, 107000, 111000, 115000,
    119000, 123000, 127000, 131000, 135000, 139000, 143000, 147000, 151000, 155000,
    160000, 165000, 170000, 175000, 180000, 185000, 190000, 195000, 200000, 205000,
    210000, 215000, 220000, 225000, 230000, 235000, 240000, 245000, 250000, 255000,
    261000, 267000, 273000, 279000, 285000, 291000, 297000, 303000, 310000, 317000,
    324000, 331000, 338000, 345000, 352000, 360000, 368000, 376000, 384000, 392000,
    400000, 408000, 417000, 426000, 435000, 444000, 453000, 463000, 463000, 483000,
    493000, 503000, 514000, 525000, 536000, 547000, 558000, 570000, 582000, 594000,
    606000, 619000, 632000, 656000, 658000, 672000, 686000, 700000, 714000, 729000,
    744000, 759000, 775000, 791000, 807000, 824000, 841000, 858000, 876000, 894000,
    912000, 931000, 950000, 969000, 989000, 1009000, 1030000, 1051000, 1073000, 1095000,
    1117000, 1140000, 1163000, 1187000, 1211000, 1236000, 1261000, 1287000, 1313000, 1340000
];

const imageForLevel: string[] = [
    'Private',
    'PrivateFirst',
    'Specialist',
    'Corporal',
    'Sergeant',
    'StaffSergeant',
    'SergeantFirstClass',
    'MasterSergeant',
    'FirstSergeant',
    'SergeantMajor',
    'CommandSergeantMajor',
    'WarrantOfficer',
    'ChiefWarrantOfficer',
    'SecondLieutenant',
    'FirstLieutenant',
    'Captain',
    'Major',
    'LieutenantColonel',
    'Colonel',
    'BrigadierGeneral',
    'MajorGeneral',
    'LieutenantGeneral',
    'General',
    'BrigadierGeneral',
    'MajorGeneral',
    'LieutenantGeneral',
    'General',
    'GeneralOfArmy'
];

@Component({
    selector: 'app-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.css'],
    encapsulation: ViewEncapsulation.None /* For checkbox style */
})
export class IntroComponent implements OnInit {

    @Input() id$: Observable<string>;
    @Output() userToCompareSelected: EventEmitter<NameAndId> = new EventEmitter<NameAndId>();

    selectedPage = 'charts';
    @Output() pageSelect: EventEmitter<string> = new EventEmitter<string>();

    name$: Observable<DisplayName[]>;
    expAndLevel$: Observable<ExpAndLevel[]>;

    filteredNames$: Observable<NameAndId[]>;

    myControl: FormControl = new FormControl();
    options: FormGroup;

    selectedUser: NameAndId;

    constructor(formBuilder: FormBuilder, private http: HttpClient) {
        this.options = formBuilder.group({
            compareChecked: false,
            myControl: this.myControl
        });
    }

    ngOnInit(): void {
        this.name$ = this.id$.pipe(
            filter(id => id !== null),
            flatMap(id => this.http.get<DisplayName[]>('/api/stats/individual/displayname?id=' + id)));

        this.expAndLevel$ = this.id$.pipe(
            filter(id => id !== null),
            flatMap(id => this.http.get<ExpAndLevel[]>('/api/stats/individual/expandlevel?id=' + id)),
            map(expAndLevels => expAndLevels.map(expAndLevel => Object.assign({}, expAndLevel, {
                percentageOfLevelCompleted: this.getPercentageOfLevelCompleted(expAndLevel),
                imageCurrentLevel: imageForLevel[Math.min(Math.ceil(expAndLevel.level / 3) - 1, imageForLevel.length - 1)],
                imageNextLevel: imageForLevel[Math.min(Math.ceil(expAndLevel.level / 3), imageForLevel.length - 1)]
            }))));

        this.http.get<NameAndId[]>('/api/allnames').subscribe(allNames => {
            this.filteredNames$ = concat(
                of(allNames),
                this.myControl.valueChanges.pipe(
                    map((filterValue) =>
                        !filterValue
                            ? allNames
                            : allNames.filter(nameAndId => nameAndId.displayName.toLocaleLowerCase().includes(filterValue)))
                ));
        });
    }

    getPercentageOfLevelCompleted(expAndLevel: ExpAndLevel): number {
        const expNeededForCurrentLevel = expForLevel[expAndLevel.level - 1];
        const expNeededForNextLevel = expForLevel[expAndLevel.level];
        const expBetweenLevels = expNeededForNextLevel - expNeededForCurrentLevel;
        return (expAndLevel.exp - expNeededForCurrentLevel) / expBetweenLevels * 100;
    }

    selectionChange(nameAndId: NameAndId, event: any) {
        if (event.isUserInput) {
            this.selectedUser = nameAndId;
            if (this.options.value.compareChecked) {
                this.userToCompareSelected.emit(this.selectedUser);
            }
        }
    }

    checkboxChange() {
        if (!this.options.value.compareChecked) {
            this.userToCompareSelected.emit(null);
        } else {
            this.userToCompareSelected.emit(this.selectedUser);
        }
    }

    selectPage(page: string) {
        this.selectedPage = page;
        this.pageSelect.emit(page);
    }
}

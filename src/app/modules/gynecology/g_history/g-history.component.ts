import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-g-history',
    templateUrl: './g-history.component.html'
})
export class GHistoryComponent implements OnInit {
    physical = new FormGroup({
        id: new FormControl('', []),
        physical_ta: new FormControl('', [Validators.required]),
        physical_fc: new FormControl('', []),
        weight: new FormControl('', []),
        height: new FormControl('', []),
        head: new FormControl('', []),
        neck: new FormControl('', []),
        thorax: new FormControl('', []),
        pregnancy: new FormControl('', []),
        exams: new FormControl('', [])
    });

    constructor() {}

    ngOnInit() {
    }
}

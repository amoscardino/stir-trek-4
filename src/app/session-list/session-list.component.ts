import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';

@Component({
    selector: 'app-session-list',
    templateUrl: './session-list.component.html',
    styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit {
    private dataService: DataService;

    constructor(dataService: DataService) {
        this.dataService = dataService;
    }

    public ngOnInit(): void {
    }

}

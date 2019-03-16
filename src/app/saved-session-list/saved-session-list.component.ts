import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { TimeSlotModel } from '../data/data.models';

@Component({
    selector: 'app-saved-session-list',
    templateUrl: './saved-session-list.component.html',
    styleUrls: ['./saved-session-list.component.scss']
})
export class SavedSessionListComponent implements OnInit {
    private dataService: DataService;

    public timeSlots: TimeSlotModel[];

    constructor(dataService: DataService) {
        this.dataService = dataService;

        this.timeSlots = <TimeSlotModel[]>[];
    }

    public ngOnInit(): void {
        this.dataService.getSavedSessionList().subscribe(schedule => this.timeSlots = schedule);
    }
}

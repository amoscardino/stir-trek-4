import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { TimeSlotModel } from '../data/data.models';

@Component({
    selector: 'app-session-list',
    templateUrl: './session-list.component.html',
    styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit {
    private dataService: DataService;

    public timeSlots: TimeSlotModel[];

    constructor(dataService: DataService) {
        this.dataService = dataService;

        this.timeSlots = <TimeSlotModel[]>[];
    }

    public ngOnInit(): void {
        this.dataService.getSchedule().subscribe(schedule => this.timeSlots = schedule);
    }
}

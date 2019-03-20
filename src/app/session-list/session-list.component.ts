import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { DataService } from '../data/data.service';
import { TimeSlotModel } from '../data/data.models';
import { Router } from '@angular/router';

@Component({
    selector: 'app-session-list',
    templateUrl: './session-list.component.html',
    styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit, AfterViewChecked {
    private dataService: DataService;
    private router: Router;

    public timeSlots: TimeSlotModel[];

    constructor(dataService: DataService, router: Router) {
        this.dataService = dataService;
        this.router = router;

        this.timeSlots = [];
    }

    public ngOnInit(): void {
        this.dataService.getSchedule().subscribe(schedule => this.timeSlots = schedule);
    }

    public ngAfterViewChecked(): void {
        const tree = this.router.parseUrl(this.router.url);

        if (tree.fragment) {
            const element = document.querySelector('#' + tree.fragment);

            if (element)
                element.scrollIntoView();
        }
    }
}

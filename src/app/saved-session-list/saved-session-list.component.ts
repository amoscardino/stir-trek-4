import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { DataService } from '../data/data.service';
import { TimeSlotModel } from '../data/data.models';
import { Router } from '@angular/router';

@Component({
    selector: 'app-saved-session-list',
    templateUrl: './saved-session-list.component.html',
    styleUrls: ['./saved-session-list.component.scss']
})
export class SavedSessionListComponent implements OnInit, AfterViewChecked {
    private dataService: DataService;
    private router: Router;

    public timeSlots: TimeSlotModel[];

    constructor(dataService: DataService, router: Router) {
        this.dataService = dataService;
        this.router = router;

        this.timeSlots = [];
    }

    public ngOnInit(): void {
        this.dataService.getSavedSessionList().subscribe(schedule => this.timeSlots = schedule);
    }

    public ngAfterViewChecked(): void {
        const tree = this.router.parseUrl(this.router.url);

        if (tree.fragment) {
            const element = document.querySelector('#' + tree.fragment);

            if (element)
                window.scroll({ top: element.getBoundingClientRect().top + window.scrollY - 72 });
        }
    }
}

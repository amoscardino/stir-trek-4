import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { SessionModel } from '../data/data.models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-session-detail',
    templateUrl: './session-detail.component.html',
    styleUrls: ['./session-detail.component.scss']
})
export class SessionDetailComponent implements OnInit {
    private data: DataService;
    private route: ActivatedRoute;

    public session: SessionModel;

    constructor(data: DataService, route: ActivatedRoute) {
        this.data = data;
        this.route = route;

        this.session = <SessionModel>{};
    }

    ngOnInit() {
        let id = +this.route.snapshot.paramMap.get('id');

        this.data.getSession(id).subscribe(session => this.session = session);
    }

}

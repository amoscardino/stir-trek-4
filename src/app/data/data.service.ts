import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StirTrek } from './data';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private data: StirTrek;
    private dataUrl: string = 'https://raw.githubusercontent.com/stirtrek/stirtrek.github.io/source/source/_data/sessions2019.json';

    constructor(http: HttpClient) {
        console.log('Getting data');

        http.get(this.dataUrl).subscribe((data: StirTrek) => {
            this.data = { ...data };

            console.log('Got data!');
            console.log(this.data);
        });
    }
}

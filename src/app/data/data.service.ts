import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionModel, TimeSlotModel } from './data.models'
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private http: HttpClient;
    private sessionsUrl: string = 'https://raw.githubusercontent.com/stirtrek/stirtrek.github.io/source/source/_data/sessions2019.json';
    private scheduleUrl: string = 'https://raw.githubusercontent.com/stirtrek/stirtrek.github.io/source/source/_data/schedule2019.json';
    private schedule: TimeSlotModel[];

    constructor(http: HttpClient) {
        this.http = http;
    }

    public getSchedule(): Observable<TimeSlotModel[]> {
        if (this.schedule)
            return of(this.schedule);

        return this.getSessionsFromApi().pipe(
            mergeMap(sessions => {
                return this.getScheduleFromApi().pipe(
                    map(schedule => {
                        this.populateSchedule(sessions, schedule);

                        return this.schedule;
                    })
                )
            })
        );
    }

    private getSessionsFromApi(): Observable<Sessions> {
        return this.http.get<Sessions>(this.sessionsUrl);
    }

    private getScheduleFromApi(): Observable<Schedule> {
        return this.http.get<Schedule>(this.scheduleUrl);
    }

    private populateSchedule(sessions: Sessions, schedule: Schedule): void {
        this.schedule = [];

        schedule.scheduledSessions.forEach(day => {
            day.timeSlots.forEach(timeSlot => {
                let timeSlotModel: TimeSlotModel = {
                    time: timeSlot.time,
                    sessions: this.getSessions(timeSlot.sessions, sessions)
                };

                this.schedule.push(timeSlotModel);
            });
        });
    }

    private getSessions(timeSlotSessions: Session[], sessions: Sessions): SessionModel[] {
        let sessionModels: SessionModel[] = [];

        timeSlotSessions.forEach(timeSlotSession => {
            let session = sessions.sessions.find(s => s.id == timeSlotSession.id);

            if (session == null)
                return;

            let sessionModel: SessionModel = {
                id: timeSlotSession.id,
                room: timeSlotSession.scheduledRoom,
                title: session.title,
                description: session.description,
                speakerName: session.speakers
                    .map(sid => {
                        let speaker = sessions.speakers.find(s => s.id == sid);

                        return speaker !== null ? speaker.fullName : null;
                    })
                    .filter(s => s !== null && s.length)
                    .join(', ')
            };

            sessionModels.push(sessionModel);
        });

        return sessionModels;
    }
}


interface Schedule {
    scheduledSessions: ScheduledSession[];
}

interface ScheduledSession {
    timeSlots: TimeSlot[];
    day: string;
}

interface TimeSlot {
    sessions: Session[];
    time: string;
}

interface Sessions {
    sessions: Session[];
    speakers: Speaker[];
}

interface Session {
    id: number;
    title: string;
    description: string;
    speakers: string[];
    scheduledRoom: string;
}

interface Speaker {
    id: string;
    fullName: string;
    bio: string;
    tagLine: string;
    profilePicture: string;
    isTopSpeaker: boolean;
    links: Link[];
}

interface Link {
    title: string;
    url: string;
    linkType: string;
}

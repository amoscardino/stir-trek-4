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

    public getSavedSessionList(): Observable<TimeSlotModel[]> {
        if (this.schedule) {
            return of(this.schedule
                .map(timeSlot => {
                    return <TimeSlotModel> {
                        time: timeSlot.time,
                        sessions: timeSlot.sessions.filter(session => session.isSaved)
                    };
                })
                .filter(timeSlot => timeSlot.sessions.length));
        }

        return this.getSessionsFromApi().pipe(
            mergeMap(sessions => {
                return this.getScheduleFromApi().pipe(
                    map(schedule => {
                        this.populateSchedule(sessions, schedule);

                        return this.schedule
                            .map(timeSlot => {
                                return <TimeSlotModel> {
                                    time: timeSlot.time,
                                    sessions: timeSlot.sessions.filter(session => session.isSaved)
                                };
                            })
                            .filter(timeSlot => timeSlot.sessions.length);
                    })
                )
            })
        );
    }

    public getSession(id: number): Observable<SessionModel> {
        if (this.schedule) {
            let session = this.schedule
                .map(t => t.sessions)
                .reduce((s, c) => s.concat(c), [])
                .find(s => s.id === id);

            return of(session);
        }

        return this.getSessionsFromApi().pipe(
            mergeMap(sessions => {
                return this.getScheduleFromApi().pipe(
                    map(schedule => {
                        this.populateSchedule(sessions, schedule);

                        let session = this.schedule
                            .map(t => t.sessions)
                            .reduce((s, c) => s.concat(c), [])
                            .find(s => s.id === id);

                        return session;
                    })
                )
            })
        );
    }

    public saveSession(id: number): void {
        let savedIds = this.getSavedSessionIds();

        if (savedIds.indexOf(id) === -1)
            savedIds.push(id);

        this.schedule.forEach(timeSlots => {
            timeSlots.sessions.forEach(session => {
                if (session.id == id)
                    session.isSaved = true;
            });
        });

        this.updateSavedSessionIds(savedIds);
    }

    public removeSavedSession(id: number) {
        let savedIds = this.getSavedSessionIds().filter(x => x != id);

        this.schedule.forEach(timeSlots => {
            timeSlots.sessions.forEach(session => {
                if (session.id == id)
                    session.isSaved = false;
            });
        });

        this.updateSavedSessionIds(savedIds);
    }

    private getSessionsFromApi(): Observable<Sessions> {
        const sessionsUrl: string = 'https://raw.githubusercontent.com/stirtrek/stirtrek.github.io/source/source/_data/sessions2019.json';

        return this.http.get<Sessions>(sessionsUrl);
    }

    private getScheduleFromApi(): Observable<Schedule> {
        const scheduleUrl: string = 'https://raw.githubusercontent.com/stirtrek/stirtrek.github.io/source/source/_data/schedule2019.json';

        return this.http.get<Schedule>(scheduleUrl);
    }

    private populateSchedule(sessions: Sessions, schedule: Schedule): void {
        this.schedule = [];

        schedule.scheduledSessions.forEach(day => {
            day.timeSlots.forEach(timeSlot => {
                let timeSlotModel: TimeSlotModel = {
                    time: timeSlot.time,
                    sessions: this.getSessions(timeSlot, sessions)
                };

                this.schedule.push(timeSlotModel);
            });
        });
    }

    private getSessions(timeSlot: TimeSlot, sessions: Sessions): SessionModel[] {
        let sessionModels: SessionModel[] = [];

        timeSlot.sessions.forEach(timeSlotSession => {
            let session = sessions.sessions.find(s => s.id == timeSlotSession.id);

            if (session == null)
                return;

            let speaker = session.speakers.map(sid => sessions.speakers.find(s => s.id == sid))[0];

            let sessionModel: SessionModel = {
                id: timeSlotSession.id,
                time: timeSlot.time,
                room: timeSlotSession.scheduledRoom,
                title: session.title,
                description: session.description,
                speakerName: speaker != null ? speaker.fullName : null,
                speakerTitle: speaker != null ? speaker.tagLine : null,
                speakerBio: speaker != null ? speaker.bio : null,
                speakerImage: speaker != null ? speaker.profilePicture : null,
                isSaved: this.getSavedSessionIds().indexOf(timeSlotSession.id) !== -1
            };

            sessionModels.push(sessionModel);
        });

        return sessionModels;
    }

    private getSavedSessionIds(): number[] {
        let savedIds = localStorage.getItem("st-saved-sessions") || "";

        return savedIds
            .split(',')
            .filter(x => x.length)
            .map(x => +x);
    }

    private updateSavedSessionIds(ids: number[]): void {
        localStorage.setItem("st-saved-sessions", ids.join(','));
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

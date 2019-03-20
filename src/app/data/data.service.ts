import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionModel, TimeSlotModel, SpeakerLinkModel } from './data.models';
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
                );
            })
        );
    }

    public getSavedSessionList(): Observable<TimeSlotModel[]> {
        if (this.schedule) {
            return of(this.schedule
                .map(timeSlot => {
                    return {
                        time: timeSlot.time,
                        timeId: timeSlot.timeId,
                        sessions: timeSlot.sessions.filter(session => session.isSaved)
                    } as TimeSlotModel;
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
                                return {
                                    time: timeSlot.time,
                                    timeId: this.getTimeId(timeSlot.time),
                                    sessions: timeSlot.sessions.filter(session => session.isSaved)
                                } as TimeSlotModel;
                            })
                            .filter(timeSlot => timeSlot.sessions.length);
                    })
                );
            })
        );
    }

    public getSession(id: number): Observable<SessionModel> {
        if (this.schedule) {
            const session = this.schedule
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

                        const session = this.schedule
                            .map(t => t.sessions)
                            .reduce((s, c) => s.concat(c), [])
                            .find(s => s.id === id);

                        return session;
                    })
                );
            })
        );
    }

    public saveSession(id: number): void {
        const savedIds = this.getSavedSessionIds();

        if (savedIds.indexOf(id) === -1)
            savedIds.push(id);

        this.schedule.forEach(timeSlots => {
            timeSlots.sessions.forEach(session => {
                if (session.id === id)
                    session.isSaved = true;
            });
        });

        this.updateSavedSessionIds(savedIds);
    }

    public removeSavedSession(id: number) {
        const savedIds = this.getSavedSessionIds().filter(x => x !== id);

        this.schedule.forEach(timeSlots => {
            timeSlots.sessions.forEach(session => {
                if (session.id === id)
                    session.isSaved = false;
            });
        });

        this.updateSavedSessionIds(savedIds);
    }

    private getSessionsFromApi(): Observable<Sessions> {
        const sessionsUrl = 'https://raw.githubusercontent.com/stirtrek/stirtrek.github.io/source/source/_data/sessions2019.json';

        return this.http.get<Sessions>(sessionsUrl);
    }

    private getScheduleFromApi(): Observable<Schedule> {
        const scheduleUrl = 'https://raw.githubusercontent.com/stirtrek/stirtrek.github.io/source/source/_data/schedule2019.json';

        return this.http.get<Schedule>(scheduleUrl);
    }

    private populateSchedule(sessions: Sessions, schedule: Schedule): void {
        this.schedule = [];

        schedule.scheduledSessions.forEach(day => {
            day.timeSlots.forEach(timeSlot => {
                const timeSlotModel: TimeSlotModel = {
                    time: timeSlot.time,
                    timeId: this.getTimeId(timeSlot.time),
                    sessions: this.getSessions(timeSlot, sessions)
                };

                this.schedule.push(timeSlotModel);
            });
        });
    }

    private getSessions(timeSlot: TimeSlot, sessions: Sessions): SessionModel[] {
        const sessionModels: SessionModel[] = [];

        timeSlot.sessions.forEach(timeSlotSession => {
            const session = sessions.sessions.find(s => s.id === timeSlotSession.id);

            if (session == null)
                return;

            const speaker = session.speakers.map(sid => sessions.speakers.find(s => s.id === sid))[0];
            let trackName = null as string;

            if (session.categoryItems != null && session.categoryItems.length) {
                trackName = sessions.categories
                    .filter(c => c.title === 'Track')[0]
                    .items
                    .filter(ci => ci.id === session.categoryItems[0])
                    .map(ci => ci.name.split('(')[0])[0];
            }

            const sessionModel = {
                id: timeSlotSession.id,

                title: session.title,
                description: session.description,

                time: timeSlot.time,
                timeId: this.getTimeId(timeSlot.time),
                room: timeSlotSession.scheduledRoom,
                track: trackName,

                speakerName: speaker != null ? speaker.fullName : null,
                speakerTitle: speaker != null ? speaker.tagLine : null,
                speakerBio: speaker != null ? speaker.bio : null,
                speakerImage: speaker != null ? speaker.profilePicture : null,
                speakerLinks: speaker != null ? speaker.links
                    .map(link => {
                        return {
                            title: link.title,
                            url: link.url
                        } as SpeakerLinkModel;
                    }) : null,

                isSaved: this.getSavedSessionIds().indexOf(timeSlotSession.id) !== -1
            } as SessionModel;

            sessionModels.push(sessionModel);
        });

        return sessionModels.sort((a, b) => {
            return (a.track.toUpperCase() > b.track.toUpperCase())
                ? 1
                : (a.track.toUpperCase() < b.track.toUpperCase())
                    ? -1
                    : 0;
        });
    }

    private getSavedSessionIds(): number[] {
        const savedIds = localStorage.getItem('st-saved-sessions') || '';

        return savedIds
            .split(',')
            .filter(x => x.length)
            .map(x => +x);
    }

    private updateSavedSessionIds(ids: number[]): void {
        localStorage.setItem('st-saved-sessions', ids.join(','));
    }

    private getTimeId(time: string): string {
        return `T${time.replace(/[^A-Za-z\d]/ig, '')}`;
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
    categories: Category[];
}

interface Session {
    id: number;
    title: string;
    description: string;
    speakers: string[];
    categoryItems?: number[];
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

interface Category {
    id: number;
    title: string;
    items: CategoryItem[];
    sort: number;
}

interface CategoryItem {
    id: number;
    name: string;
    sort: number;
}

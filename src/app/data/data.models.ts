export interface TimeSlotModel {
    time: string;
    timeId: string;
    sessions: SessionModel[];
}

export interface SessionModel {
    id: number;

    title: string;
    description: string;

    time: string;
    timeId: string;
    track: string;
    room: string;
    theatres: TheatreModel[];

    speakerName: string;
    speakerTitle: string;
    speakerBio: string;
    speakerImage: string;
    speakerLinks?: SpeakerLinkModel[];

    isSaved: boolean;
}

export interface TheatreModel {
    theatre: string;
    speaker: boolean;
}

export interface SpeakerLinkModel {
    title: string;
    url: string;
}

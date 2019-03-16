export interface TimeSlotModel {
    time: string;
    sessions: SessionModel[];
}

export interface SessionModel {
    id: number;

    title: string;
    description: string;

    time: string;
    room: string;
    track: string;

    speakerName: string;
    speakerTitle: string;
    speakerBio: string;
    speakerImage: string;
    speakerLinks?: SpeakerLinkModel[];

    isSaved: boolean;
}

export interface SpeakerLinkModel {
    title: string;
    url: string;
}
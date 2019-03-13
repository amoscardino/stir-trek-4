export interface TimeSlotModel {
    time: string;
    sessions: SessionModel[];
}

export interface SessionModel {
    id: number;
    time: string;
    room: string;
    title: string;
    description: string;
    speakerName: string;
    speakerTitle: string;
    speakerBio: string;
    speakerImage: string;
}

export interface TimeSlotModel {
    time: string;
    sessions: SessionModel[];
}

export interface SessionModel {
    id: number;
    room: string;
    title: string;
    description: string;
    speakerName: string;
}

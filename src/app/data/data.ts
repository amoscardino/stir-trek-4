
export interface StirTrek {
    sessions:   Session[];
    speakers:   Speaker[];
    questions:  any[];
    categories: Category[];
    rooms:      Room[];
}

export interface Category {
    id:    number;
    title: string;
    items: Room[];
    sort:  number;
}

export interface Room {
    id:   number;
    name: string;
    sort: number;
}

export interface Session {
    id:                string;
    title:             string;
    description:       string;
    speakers:          string[];
    startsAt?:         null;
    endsAt?:           null;
    isServiceSession?: boolean;
    isPlenumSession?:  boolean;
    categoryItems?:    number[];
    questionAnswers?:  any[];
    roomID?:           null;
}

export interface Speaker {
    id:             string;
    firstName:      string;
    lastName:       string;
    bio:            string;
    tagLine:        string;
    profilePicture: string;
    isTopSpeaker:   boolean;
    links:          Link[];
    sessions:       number[];
    fullName:       string;
}

export interface Link {
    title:    string;
    url:      string;
    linkType: string;
}

export interface Subtitle {
    time: string;
    nextTime?: string;
    text: string;
    prevText?: string
    nextText?: string;
    id: string;
    startSeconds: number;
    endSeconds: number;
    title: string;
    disabled?: boolean;
    hash: string;
}


export interface Caption {
    name: {
        simpleText: string;
    };
    languageCode: string;
    baseUrl: string;
}
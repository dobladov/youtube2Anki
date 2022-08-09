export interface Subtitle {
    time: number;
    nextTime?: number;
    text: string;
    prevText: string
    nextText: string;
    id: string;
    startSeconds: number;
    endSeconds: number;
    title: string;
    disabled?: boolean;
    hash: string;
}
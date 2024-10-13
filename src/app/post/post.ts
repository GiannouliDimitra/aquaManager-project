export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
    username?: string; // Optional, as it may not always be present
}

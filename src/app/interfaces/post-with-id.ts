import { Post } from "./post";

export interface PostWithId extends Post {
    id: string;
    isInEditMode?: boolean;
}
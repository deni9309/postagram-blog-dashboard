export interface Post {
    title: string;
    permalink: string;
    category: {
        categoryId: string,
        category: string
    };
    postImgPath: string;
    refFullPath?: string | null;
    excerpt: string;
    content: string;
    isFeatured: boolean;
    views: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
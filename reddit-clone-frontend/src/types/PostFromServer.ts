export type PostFromServer = {
    _id: string;
    title: string;
    content: string;
    author: {
      _id: string;
      username: string;
    };
    createdAt: string;
    commentCount: number;
    postType: "text" | "image" | "link" | "poll";
    score?: number;
    imageUrl?: string;
  };
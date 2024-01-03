export interface Post {
    _id: string;
    creatorName: string;
    creatorEmail: string;
    title: string;
    creationDateTime: string;
    description: string;
    likes: string[];
    bookmarks: string[];
    comments: { _id: string, body: string; commenterEmail: string, commenterUsername: string, date: string }[];
}
export interface Comment {
    _id: string,
    body: string;
    commenterEmail: string;
    commenterUsername: string;
    date: string;
}

export interface TableData {
    title: string;
    creationDateTime: string;
    content: string;
    comments: { _id: string, body: string; commenterEmail: string, commenterUsername: string, date: string }[];
  }
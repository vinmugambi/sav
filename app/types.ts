export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Album {
  id: number;
  userId: number;
  title: string;
}

export interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export type UserWithAlbumCount = User & {
  albumCount: number;
};

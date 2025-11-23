export type Note = {
  id: string;
  title: string;
  body: string;
  imageUri?: string | null;
  createdAt: number;
  updatedAt: number;
};
export type User = { id: string; username: string; pin: string };

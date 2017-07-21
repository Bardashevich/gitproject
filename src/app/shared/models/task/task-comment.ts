import {PublicUser} from "../users/public-user";
export class TaskComment {
  id: number;
  taskId: number;
  commentAuthor: PublicUser;
  commentAuthorId: number;
  text: string;
  dateCreated: string;
}
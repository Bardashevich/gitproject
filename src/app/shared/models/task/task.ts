import {PublicUser} from "../users/public-user";
import {ContactModel} from "../contacts/ContactDto";
import {TaskComment} from "./task-comment";
import {GridEntity} from "../grid/grid-entity";
import {NamedEntity} from "../named-entity";
export class Task extends GridEntity {
  id: number;
  name: string;
  location: string;
  description: string;
  endDate: Date;
  startDate: Date;
  assignee: PublicUser = new PublicUser;
  creator: PublicUser;
  status: NamedEntity = new NamedEntity;
  priority: NamedEntity = new NamedEntity;
  companies: Array<any> = [];
  contacts: Array<ContactModel> = [];
  comments: Array<TaskComment> = [];

  timeless: boolean;
}
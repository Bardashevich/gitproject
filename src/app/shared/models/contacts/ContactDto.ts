import {OrderDto} from "./OrderDto";
import {GridEntity} from "../grid/grid-entity";

export class ContactModel extends GridEntity {
  id: number = 0;
  firstNameEn: string = '';
  lastNameEn: string = '';
  firstName: string = '';
  lastName: string = '';
  patronymic: string = '';
  dateOfBirth: string = '';
  isMale: boolean;
  nationality: string = '';
  photoUrl: string;
  industry: string;
  position: string;
  linkedInId: number;
  orders: OrderDto[] = [];
  MessengerAccountDto: any[] = [];
  socialNetworks: any[] = [];
  telephones: any[] = [];
  addresses: any[] = [];
  workplaces: any[] = [];
  emails: any[] = [];
  attachments: any[] = [];
  skills: any[] = [];
  history: any = null;
  educations: any[] = [];
  comments: any[] = [];
  languages: any[] = [];
  userId: number;
  readingCommentsDate: string;
  countUnreadComments: number;

  selected: false;

  /*Grid fields*/
  fullName: string;
  firstEmail: string;
  firstTelephone: string;
  firstAddress: string;
}

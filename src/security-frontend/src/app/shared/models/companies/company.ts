import {NamedEntity} from "../named-entity";
import {GridEntity} from "../grid/grid-entity";
export class Company extends GridEntity {
  id: number;
  name: string;
  logoUrl: string;
  companyType: NamedEntity;
  businessSphere: NamedEntity;
  employeeNumberCategory: NamedEntity;
  commentary: string;

  /*Grid fields*/
  employeeNumber: string;
}
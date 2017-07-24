export class Role {
  id: number;
  name: string;
  description: string;
  parent: Role;
  privileges: any[];

  checked: boolean;
}
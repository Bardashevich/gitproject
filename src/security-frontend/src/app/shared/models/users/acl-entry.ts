export class AclEntry {
  id: number;
  principalId: number;
  name: string;
  principalTypeName: string;
  canRead: boolean;
  canWrite: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canAdmin: boolean;

  selected: boolean;
}
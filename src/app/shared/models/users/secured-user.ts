import {PublicUser} from "./public-user";
import {Role} from "./role";
import {Group} from "./group";
import {AclEntry} from "./acl-entry";

export class SecuredUser extends PublicUser {
  password: string;
  active: boolean;
  roles: Array<Role>;
  groups: Array<Group>;
  acls: Array<AclEntry>;
}
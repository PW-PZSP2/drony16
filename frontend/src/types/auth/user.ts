import type { UserRoles } from "./user_role";

export interface User {
  username: string;
  email: string;
  roles: UserRoles;
}

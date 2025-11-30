import { UserRoles } from "./user_role";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRoles;
}

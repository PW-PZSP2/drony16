
import type { UserRoles } from "./user_role";

export interface User {
  user_name: string;
  email: string;
  phone_number: string;
  roles: UserRoles;
}

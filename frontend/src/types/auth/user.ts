import type { UserRoles } from "./user_role";

export interface User {
  user_id: number;
  user_name: string;
  email: string;
  phone_number: string;
  roles: UserRoles;
  localisation?: string;
  area?: number;
}

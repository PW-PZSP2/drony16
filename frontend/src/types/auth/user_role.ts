export const Roles = {
  ADMIN: "admin",
  OPERATOR: "operator",
  CLIENT: "client",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
export type UserRoles = Role[];

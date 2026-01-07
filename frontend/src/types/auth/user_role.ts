export const Roles = {
  ADMIN: "adm",
  OPERATOR: "ope",
  CLIENT: "cli",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
export type UserRoles = Role[];

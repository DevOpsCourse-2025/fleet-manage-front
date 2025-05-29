import type { AdminPublic } from "./admin";

export type InvitationPublic = {
  id: string;
  adminId: string;
  admin: AdminPublic;
};

import type { Access, FieldAccess } from "payload";

/** Solo administradores (gestión CRM / newsletter en admin). */
export const adminOnly: Access = ({ req }) => req.user?.role === "admin";

/** Campos internos: solo staff autenticado puede escribirlos vía admin/API. */
export const staffOnlyFieldAccess: {
  create?: FieldAccess;
  update?: FieldAccess;
} = {
  create: ({ req }) => Boolean(req.user),
  update: ({ req }) => Boolean(req.user),
};

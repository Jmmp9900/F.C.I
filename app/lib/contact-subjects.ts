export const CONTACT_SUBJECT_KEYS = [
  "schedule_advisory",
  "hire_service",
  "collaboration",
  "custom_training",
  "other",
] as const;

export type ContactSubjectKey = (typeof CONTACT_SUBJECT_KEYS)[number];

export function isContactSubjectKey(value: string): value is ContactSubjectKey {
  return (CONTACT_SUBJECT_KEYS as readonly string[]).includes(value);
}

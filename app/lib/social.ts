import { getWhatsAppChatHref } from "./whatsapp";

/** Enlaces oficiales (sitio anterior consultoresinternacionales.org). */
export const SOCIAL_LINKS = [
  {
    id: "facebook" as const,
    href: "https://www.facebook.com/FConsultoresInternacionales/",
  },
  {
    id: "instagram" as const,
    href: "https://www.instagram.com/fcinternacionales/",
  },
  {
    id: "twitter" as const,
    href: "https://twitter.com/FundacionCInt",
  },
  {
    id: "linkedin" as const,
    href: "https://www.linkedin.com/in/fundaci%C3%B3n-consultores-internacionales-fci-27200151",
  },
  {
    id: "youtube" as const,
    href: "https://www.youtube.com/channel/UCpsx9uHlXm4nmSEIP9d9kYw",
  },
  {
    id: "whatsapp" as const,
    get href() {
      return getWhatsAppChatHref();
    },
  },
] as const;

export type SocialNetworkId = (typeof SOCIAL_LINKS)[number]["id"];

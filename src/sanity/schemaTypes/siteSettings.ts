import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "navigation", title: "Navigation" },
  ],
  fields: [
    defineField({
      name: "companyName",
      title: "Nom de l'entreprise",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slogan",
      title: "Slogan",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "serviceArea",
      title: "Zone de service",
      type: "string",
      description: "Ex: Martinique, Fort-de-France et environs",
    }),
    defineField({
      name: "heroHeadline",
      title: "Titre principal",
      type: "string",
      description: "Première ligne du titre hero",
      group: "hero",
    }),
    defineField({
      name: "heroHeadlineAccent",
      title: "Titre accentué",
      type: "string",
      description: "Partie mise en couleur du titre hero",
      group: "hero",
    }),
    defineField({
      name: "heroDescription",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Paragraphe sous le titre hero",
      group: "hero",
    }),
    defineField({
      name: "heroPrimaryCta",
      title: "Bouton principal",
      type: "string",
      description: "Ex : Voir le catalogue",
      group: "hero",
    }),
    defineField({
      name: "heroSecondaryCta",
      title: "Bouton secondaire",
      type: "string",
      description: "Ex : Demander un devis",
      group: "hero",
    }),
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
      group: "navigation",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "page",
              title: "Page",
              type: "reference",
              to: [{ type: "page" }],
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "string",
              description: "Ex: /produits, /",
            }),
          ],
          validation: (rule) =>
            rule.custom((item) => {
              const obj = item as
                | { page?: { _ref?: string }; url?: string }
                | undefined;
              if (!obj?.page?._ref && !obj?.url) {
                return "Renseignez au moins une page ou une URL";
              }
              return true;
            }),
          preview: {
            select: { title: "label" },
          },
        },
      ],
    }),
    defineField({
      name: "footerLinks",
      title: "Liens du pied de page",
      type: "array",
      group: "navigation",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "page",
              title: "Page",
              type: "reference",
              to: [{ type: "page" }],
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "string",
              description: "Ex: /a-propos, /mentions-legales",
            }),
          ],
          validation: (rule) =>
            rule.custom((item) => {
              const obj = item as
                | { page?: { _ref?: string }; url?: string }
                | undefined;
              if (!obj?.page?._ref && !obj?.url) {
                return "Renseignez au moins une page ou une URL";
              }
              return true;
            }),
          preview: {
            select: { title: "label" },
          },
        },
      ],
    }),
  ],
});

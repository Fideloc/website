import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
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
      name: "heroCta",
      title: "Bouton d'appel à l'action",
      type: "string",
      description: "Texte du bouton d'appel à l'action",
    }),
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
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
  ],
});

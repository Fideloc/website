import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Produit",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      description: "Ex: M001, G004",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texte alternatif",
              type: "string",
            }),
          ],
        },
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      description: "Ex: 220 x 75 cm",
    }),
    defineField({
      name: "capacity",
      title: "Capacité",
      type: "number",
      description: "Ex: nombre de personnes assises",
    }),
    defineField({
      name: "priceWeek",
      title: "Prix semaine",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "priceWeekend",
      title: "Prix week-end",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Nom",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Catégorie",
      name: "categoryAsc",
      by: [{ field: "category.name", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      code: "code",
      categoryName: "category.name",
      media: "images.0",
    },
    prepare({ title, code, categoryName, media }) {
      const parts = [code, categoryName].filter(Boolean);
      return {
        title,
        subtitle: parts.join(" — "),
        media,
      };
    },
  },
});

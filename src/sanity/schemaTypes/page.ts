import { defineField, defineType } from "sanity";

const templatesWithUiLabels = new Set([
  "home",
  "contact",
  "productsIndex",
  "productCategory",
  "productDetail",
]);

const getTemplate = (document: unknown): string => {
  if (!document || typeof document !== "object") {
    return "";
  }
  const template = (document as { template?: unknown }).template;
  return typeof template === "string" ? template : "";
};

const showOnlyForTemplates =
  (templates: string[]) =>
  ({ document }: { document?: unknown }) =>
    !templates.includes(getTemplate(document));

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "identity", title: "Identité" },
    { name: "editorial", title: "Éditorial" },
    { name: "labels", title: "Libellés UI" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required(),
      group: "identity",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
      group: "identity",
    }),
    defineField({
      name: "template",
      title: "Type de page",
      type: "string",
      group: "identity",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Accueil", value: "home" },
          { title: "Contact", value: "contact" },
          { title: "Catalogue produits", value: "productsIndex" },
          { title: "Template catégorie produit", value: "productCategory" },
          { title: "Template fiche produit", value: "productDetail" },
          { title: "Moodboard", value: "moodboard" },
        ],
        layout: "dropdown",
      },
      initialValue: "standard",
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
      group: "editorial",
    }),
    defineField({
      name: "content",
      title: "Contenu",
      type: "array",
      of: [{ type: "block" }],
      group: "editorial",
    }),
    defineField({
      name: "labels",
      title: "Libellés d'interface",
      type: "object",
      group: "labels",
      hidden: ({ document }) =>
        !templatesWithUiLabels.has(getTemplate(document)),
      fields: [
        defineField({
          name: "sectionTitle",
          title: "Titre de section",
          type: "string",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "backLabel",
          title: "Libellé de retour",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory"]),
        }),
        defineField({
          name: "reservationTitle",
          title: "Titre réservation/formulaire",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "phoneLabel",
          title: "Libellé téléphone",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "emailLabel",
          title: "Libellé email",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "serviceAreaLabel",
          title: "Libellé zone de service",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "emptyState",
          title: "Message d'état vide",
          type: "string",
          hidden: showOnlyForTemplates(["productsIndex", "productCategory"]),
        }),
        defineField({
          name: "breadcrumbCatalogLabel",
          title: "Libellé breadcrumb catalogue",
          type: "string",
          hidden: showOnlyForTemplates(["productDetail"]),
        }),
        defineField({
          name: "specDimensionsLabel",
          title: "Libellé dimensions",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory", "productDetail"]),
        }),
        defineField({
          name: "productCodeLabel",
          title: "Libellé code produit",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory", "productDetail"]),
        }),
        defineField({
          name: "specCapacityLabel",
          title: "Libellé capacité",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory", "productDetail"]),
        }),
        defineField({
          name: "capacityUnit",
          title: "Unité capacité",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory", "productDetail"]),
        }),
        defineField({
          name: "priceWeekendSuffix",
          title: "Suffixe prix week-end",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory", "productDetail"]),
        }),
        defineField({
          name: "priceWeekSuffix",
          title: "Suffixe prix semaine",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory", "productDetail"]),
        }),
        defineField({
          name: "quoteCtaLabel",
          title: "Libellé bouton devis",
          type: "string",
          hidden: showOnlyForTemplates(["productDetail"]),
        }),
        defineField({
          name: "backToCategoryPrefix",
          title: "Préfixe retour catégorie",
          type: "string",
          hidden: showOnlyForTemplates(["productDetail"]),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      template: "template",
    },
    prepare({ title, slug, template }) {
      const suffix = [template, slug ? `/${slug}` : null]
        .filter(Boolean)
        .join(" · ");
      return {
        title,
        subtitle: suffix,
      };
    },
  },
});

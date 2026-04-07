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
          title: "Titre section catégories",
          type: "string",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "categoriesViewAllLabel",
          title: "Libellé bouton « Tout voir »",
          type: "string",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "aboutTeaserHeadlineLine1",
          title: "Section À propos · Titre ligne 1",
          type: "string",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "aboutTeaserHeadlineLine2",
          title: "Section À propos · Titre ligne 2",
          type: "string",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "aboutTeaserSecondParagraph",
          title: "Section À propos · Second paragraphe",
          type: "text",
          rows: 3,
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "aboutTeaserBadge",
          title: "Section À propos · Badge",
          type: "string",
          description: "Ex : Depuis 2020",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "aboutTeaserCtaLabel",
          title: "Section À propos · Libellé bouton",
          type: "string",
          description: "Ex : En savoir plus",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "quoteCtaBadge",
          title: "Bloc devis · Badge",
          type: "string",
          description: "Ex : Devis gratuit",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "quoteCtaHeadlineLine1",
          title: "Bloc devis · Titre ligne 1",
          type: "string",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "quoteCtaHeadlineLine2",
          title: "Bloc devis · Titre ligne 2",
          type: "string",
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "quoteCtaDescription",
          title: "Bloc devis · Description",
          type: "text",
          rows: 3,
          hidden: showOnlyForTemplates(["home"]),
        }),
        defineField({
          name: "quoteCtaButtonLabel",
          title: "Bloc devis · Libellé bouton",
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
          name: "formContactSectionTitle",
          title: "Formulaire · Titre section coordonnées",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formNeedSectionTitle",
          title: "Formulaire · Titre section besoin",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formDetailsSectionTitle",
          title: "Formulaire · Titre section précisions",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formNameLabel",
          title: "Formulaire · Libellé champ nom",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formNamePlaceholder",
          title: "Formulaire · Placeholder champ nom",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formEmailLabel",
          title: "Formulaire · Libellé champ email",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formEmailPlaceholder",
          title: "Formulaire · Placeholder champ email",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formPhoneLabel",
          title: "Formulaire · Libellé champ téléphone",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formPhonePlaceholder",
          title: "Formulaire · Placeholder champ téléphone",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formCategoryLabel",
          title: "Formulaire · Libellé champ catégorie",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formCategoryPlaceholder",
          title: "Formulaire · Placeholder champ catégorie",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formDateRangeLabel",
          title: "Formulaire · Libellé période de location",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formDateStartA11yLabel",
          title: "Formulaire · Libellé accessible date début",
          type: "string",
          description: "Ex : Date de début",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formDateEndA11yLabel",
          title: "Formulaire · Libellé accessible date fin",
          type: "string",
          description: "Ex : Date de fin",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formDeliveryLabel",
          title: "Formulaire · Libellé case livraison",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formDeliveryDescription",
          title: "Formulaire · Description case livraison",
          type: "text",
          rows: 3,
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formMessageLabel",
          title: "Formulaire · Libellé champ message",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formMessagePlaceholder",
          title: "Formulaire · Placeholder champ message",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formSubmitLabel",
          title: "Formulaire · Libellé bouton envoyer",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formSubmitLoadingLabel",
          title: "Formulaire · Libellé bouton envoyer (chargement)",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formSubmitDisclaimer",
          title: "Formulaire · Mention sous le bouton",
          type: "text",
          rows: 3,
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formSuccessTitle",
          title: "Formulaire · Titre succès",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formSuccessMessage",
          title: "Formulaire · Message succès",
          type: "text",
          rows: 3,
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formSuccessNewRequestLabel",
          title: "Formulaire · Libellé bouton nouvelle demande",
          type: "string",
          hidden: showOnlyForTemplates(["contact"]),
        }),
        defineField({
          name: "formGenericError",
          title: "Formulaire · Message d'erreur générique",
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
          hidden: showOnlyForTemplates(["productDetail", "productCategory"]),
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
          name: "priceWeekendShortSuffix",
          title: "Suffixe court prix week-end",
          description: "Version compacte affichée sur les cartes produit",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory"]),
        }),
        defineField({
          name: "priceWeekShortSuffix",
          title: "Suffixe court prix semaine",
          description: "Version compacte affichée sur les cartes produit",
          type: "string",
          hidden: showOnlyForTemplates(["productCategory"]),
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

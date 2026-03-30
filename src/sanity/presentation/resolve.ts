import { defineDocuments, defineLocations } from "sanity/presentation";

export const mainDocuments = defineDocuments([
  {
    route: "/produits/:categorie/:slug",
    filter: `_type == "product" && slug.current == $slug`,
  },
  {
    route: "/produits/:categorie",
    filter: `_type == "category" && slug.current == $categorie`,
  },
  {
    route: "/:slug",
    filter: `_type == "page" && slug.current == $slug`,
  },
]);

export const locations = {
  product: defineLocations({
    select: {
      title: "name",
      slug: "slug.current",
      categorySlug: "category.slug.current",
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Produit",
          href: `/produits/${doc?.categorySlug}/${doc?.slug}`,
        },
        {
          title: "Catégorie",
          href: `/produits/${doc?.categorySlug}`,
        },
      ],
    }),
  }),
  category: defineLocations({
    select: { title: "name", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Catégorie",
          href: `/produits/${doc?.slug}`,
        },
        { title: "Tous les produits", href: "/produits" },
      ],
    }),
  }),
  page: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Page",
          href: `/${doc?.slug}`,
        },
      ],
    }),
  }),
  siteSettings: defineLocations({
    message: "Ce document est utilisé sur toutes les pages du site",
    tone: "caution",
    locations: [{ title: "Accueil", href: "/" }],
  }),
};

import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu")
    .items([
      S.listItem()
        .title("Paramètres du site")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("category").title("Catégories"),
      S.documentTypeListItem("product").title("Produits"),
    ]);

import { defineQuery } from "groq";

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  companyName, slogan, phone, email, serviceArea,
  heroHeadline, heroHeadlineAccent, heroDescription, heroPrimaryCta, heroSecondaryCta,
  navigation[]{ _key, label, url, page->{ title, "slug": slug.current } },
  footerLinks[]{ _key, label, url, page->{ title, "slug": slug.current } }
}`);

export const ALL_CATEGORIES_QUERY =
  defineQuery(`*[_type == "category"] | order(order asc){
  _id, name, "slug": slug.current, description, order, image{ asset, alt, hotspot, crop }
}`);

export const CATEGORY_BY_SLUG_QUERY =
  defineQuery(`*[_type == "category" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, description
}`);

export const PRODUCTS_BY_CATEGORY_QUERY =
  defineQuery(`*[_type == "product" && category._ref == $categoryId] | order(order asc){
  _id, name, code, "slug": slug.current, dimensions, capacity,
  priceWeek, priceWeekend, images[0]{ asset, alt }, description
}`);

export const PRODUCT_BY_SLUG_QUERY =
  defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id, name, code, "slug": slug.current,
  category->{ _id, name, "slug": slug.current },
  images[]{ asset, alt, hotspot, crop, _key },
  description, dimensions, capacity, priceWeek, priceWeekend
}`);

export const ALL_PRODUCT_SLUGS_QUERY = defineQuery(`*[_type == "product"]{
  "slug": slug.current, "categorie": category->slug.current
}`);

export const PAGE_BY_SLUG_QUERY =
  defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  template,
  intro,
  labels{
    sectionTitle,
    backLabel,
    reservationTitle,
    phoneLabel,
    emailLabel,
    serviceAreaLabel,
    emptyState,
    breadcrumbCatalogLabel,
    specDimensionsLabel,
    productCodeLabel,
    specCapacityLabel,
    capacityUnit,
    priceWeekendSuffix,
    priceWeekSuffix,
    quoteCtaLabel,
    backToCategoryPrefix
  },
  content
}`);

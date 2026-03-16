import { defineQuery } from "groq";

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  companyName, slogan, phone, email, serviceArea, heroCta,
  navigation[]{ _key, label, url, page->{ title, "slug": slug.current } },
  footerLinks[]{ _key, label, url, page->{ title, "slug": slug.current } }
}`);

export const ALL_CATEGORIES_QUERY =
  defineQuery(`*[_type == "category"] | order(order asc){
  _id, name, "slug": slug.current, description, order
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

export const PAGE_BY_SLUG_QUERY =
  defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, content
}`);

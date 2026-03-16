import { sanityClient } from "sanity:client";
import { createImageUrlBuilder } from "@sanity/image-url";
import {
  ALL_CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  PAGE_BY_SLUG_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  SITE_SETTINGS_QUERY,
} from "./sanity.queries";

// Image URL builder
const builder = createImageUrlBuilder(sanityClient);
export function urlFor(source: any) {
  return builder.image(source);
}

// Helper functions
export async function getSiteSettings() {
  return sanityClient.fetch(SITE_SETTINGS_QUERY);
}

export async function getAllCategories() {
  return sanityClient.fetch(ALL_CATEGORIES_QUERY);
}

export async function getCategoryBySlug(slug: string) {
  return sanityClient.fetch(CATEGORY_BY_SLUG_QUERY, { slug });
}

export async function getProductsByCategory(categoryId: string) {
  return sanityClient.fetch(PRODUCTS_BY_CATEGORY_QUERY, { categoryId });
}

export async function getPageBySlug(slug: string) {
  return sanityClient.fetch(PAGE_BY_SLUG_QUERY, { slug });
}

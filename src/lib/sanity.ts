import { sanityClient } from "sanity:client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { loadQuery } from "./load-query";
import {
  ALL_CATEGORIES_QUERY,
  ALL_PRODUCT_SLUGS_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  PAGE_BY_SLUG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  SITE_SETTINGS_QUERY,
} from "./sanity.queries";
import type {
  ALL_CATEGORIES_QUERY_RESULT,
  ALL_PRODUCT_SLUGS_QUERY_RESULT,
  CATEGORY_BY_SLUG_QUERY_RESULT,
  PAGE_BY_SLUG_QUERY_RESULT,
  PRODUCT_BY_SLUG_QUERY_RESULT,
  PRODUCTS_BY_CATEGORY_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "./sanity.types";

// Image URL builder
const builder = createImageUrlBuilder(sanityClient);
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper functions
export async function getSiteSettings() {
  return loadQuery<SITE_SETTINGS_QUERY_RESULT>({
    query: SITE_SETTINGS_QUERY,
  });
}

export async function getAllCategories() {
  return loadQuery<ALL_CATEGORIES_QUERY_RESULT>({
    query: ALL_CATEGORIES_QUERY,
  });
}

export async function getCategoryBySlug(slug: string) {
  return loadQuery<CATEGORY_BY_SLUG_QUERY_RESULT>({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug },
  });
}

export async function getProductsByCategory(categoryId: string) {
  return loadQuery<PRODUCTS_BY_CATEGORY_QUERY_RESULT>({
    query: PRODUCTS_BY_CATEGORY_QUERY,
    params: { categoryId },
  });
}

export async function getProductBySlug(slug: string) {
  return loadQuery<PRODUCT_BY_SLUG_QUERY_RESULT>({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });
}

export async function getAllProductSlugs() {
  return loadQuery<ALL_PRODUCT_SLUGS_QUERY_RESULT>({
    query: ALL_PRODUCT_SLUGS_QUERY,
  });
}

export async function getPageBySlug(slug: string) {
  return loadQuery<PAGE_BY_SLUG_QUERY_RESULT>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug },
  });
}

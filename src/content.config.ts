// Empty content config to silence the Astro 6 "[content] Content config not loaded" warning.
// This project uses Sanity as its CMS via @sanity/astro, which provides its own `sanity:client`
// virtual module for GROQ queries — it does not use Astro's Content Layer API.
// There is no official Sanity content layer loader yet (see https://github.com/sanity-io/sanity-astro/issues/289).
import { defineCollection } from "astro:content";

export const collections = {};

import { z } from "astro/zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.email("Adresse email invalide."),
  phone: z
    .string()
    .min(10, "Le numéro doit contenir au moins 10 chiffres.")
    .regex(
      /^(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Format de téléphone invalide (ex : 06 12 34 56 78 ou +33 6 12 34 56 78).",
    ),
  category: z.string().min(1, "Veuillez sélectionner une catégorie."),
  dateStart: z.string().min(1, "Veuillez indiquer une date de début."),
  dateEnd: z.string().min(1, "Veuillez indiquer une date de fin."),
  message: z.string().optional(),
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

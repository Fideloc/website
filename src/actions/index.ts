import { defineAction, ActionError } from "astro:actions";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas/contact";
import { getSiteSettings } from "@/lib/sanity";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  sendContactEmail: defineAction({
    input: contactSchema,
    handler: async (input) => {
      // Honeypot: silent success if filled
      if (input.website) {
        return { success: true };
      }

      // Validate date range
      if (input.dateEnd < input.dateStart) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "La date de fin doit être après la date de début.",
        });
      }

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:system-ui,-apple-system,sans-serif;background:#f7f8fa">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff">
    <tr>
      <td style="background:#1a2b4a;padding:24px 32px">
        <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">Nouvelle demande de réservation</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eef1f5">
              <strong style="color:#1a2b4a">Nom</strong><br>
              <span style="color:#1e293b">${input.name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eef1f5">
              <strong style="color:#1a2b4a">Email</strong><br>
              <a href="${input.email}" style="color:#e07a2f">${input.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eef1f5">
              <strong style="color:#1a2b4a">Téléphone</strong><br>
              <a href="${input.phone}" style="color:#e07a2f">${input.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eef1f5">
              <strong style="color:#1a2b4a">Catégorie</strong><br>
              <span style="color:#1e293b">${input.category}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eef1f5">
              <strong style="color:#1a2b4a">Période</strong><br>
              <span style="color:#1e293b">Du ${input.dateStart} au ${input.dateEnd}</span>
            </td>
          </tr>
          ${
            input.message
              ? `<tr>
            <td style="padding:8px 0">
              <strong style="color:#1a2b4a">Message</strong><br>
              <span style="color:#1e293b">${input.message}</span>
            </td>
          </tr>`
              : ""
          }
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#f7f8fa;padding:16px 32px;text-align:center">
        <p style="margin:0;color:#6b7280;font-size:12px">Envoyé depuis le formulaire de contact fideloc.fr</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

      const settings = await getSiteSettings();
      if (!settings?.email) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Adresse de contact non configurée.",
        });
      }

      const { error } = await resend.emails.send({
        from: `Fidéloc <${settings.email}>`,
        to: [settings.email],
        replyTo: input.email,
        subject: `Nouvelle demande - ${input.category}`,
        html,
      });

      if (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "L'envoi de l'email a échoué. Veuillez réessayer.",
        });
      }

      return { success: true };
    },
  }),
};

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { IconSend, IconCircleCheck, IconLoader2 } from "@tabler/icons-react";

interface Props {
  categories: { name: string; slug: string }[];
}

export default function ContactForm({ categories }: Props) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "",
      dateStart: "",
      dateEnd: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("idle");
    setErrorMessage("");

    const { error } = await actions.sendContactEmail(data);

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("success");
    reset();
  }

  if (status === "success") {
    return (
      <div className="border-border rounded-lg border p-8 text-center">
        <IconCircleCheck className="text-brand-accent mx-auto size-12" />
        <h3 className="font-heading text-primary mt-4 text-xl font-semibold">
          Demande envoyée !
        </h3>
        <p className="text-muted-foreground mt-2">
          Nous reviendrons vers vous dans les meilleurs délais.
        </p>
        <Button
          variant="subtle"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Envoyer une autre demande
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {status === "error" && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-4 text-sm">
          {errorMessage || "Une erreur est survenue. Veuillez réessayer."}
        </div>
      )}

      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nom complet</FieldLabel>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              id="name"
              placeholder="Jean Dupont"
              aria-invalid={!!errors.name}
              {...field}
            />
          )}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                id="email"
                type="email"
                placeholder="jean@exemple.fr"
                aria-invalid={!!errors.email}
                {...field}
              />
            )}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                aria-invalid={!!errors.phone}
                {...field}
              />
            )}
          />
          <FieldError>{errors.phone?.message}</FieldError>
        </Field>
      </div>

      <Field data-invalid={!!errors.category}>
        <FieldLabel htmlFor="category">Catégorie d'équipement</FieldLabel>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="category"
                className="w-full"
                aria-invalid={!!errors.category}
              >
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.category?.message}</FieldError>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.dateStart}>
          <FieldLabel htmlFor="dateStart">Date de début</FieldLabel>
          <Controller
            name="dateStart"
            control={control}
            render={({ field }) => (
              <Input
                id="dateStart"
                type="date"
                aria-invalid={!!errors.dateStart}
                {...field}
              />
            )}
          />
          <FieldError>{errors.dateStart?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.dateEnd}>
          <FieldLabel htmlFor="dateEnd">Date de fin</FieldLabel>
          <Controller
            name="dateEnd"
            control={control}
            render={({ field }) => (
              <Input
                id="dateEnd"
                type="date"
                aria-invalid={!!errors.dateEnd}
                {...field}
              />
            )}
          />
          <FieldError>{errors.dateEnd?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="message">
          Message <span className="text-muted-foreground">(optionnel)</span>
        </FieldLabel>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <Textarea
              id="message"
              placeholder="Précisez vos besoins : quantité, dimensions, lieu de livraison…"
              rows={4}
              {...field}
            />
          )}
        />
      </Field>

      <div
        className="absolute h-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <input type="text" tabIndex={-1} autoComplete="off" {...field} />
          )}
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <IconLoader2 className="animate-spin" data-icon="inline-start" />
        ) : (
          <IconSend data-icon="inline-start" />
        )}
        {isSubmitting ? "Envoi en cours…" : "Envoyer la demande"}
      </Button>
    </form>
  );
}

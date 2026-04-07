import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";
import { stegaClean } from "@sanity/client/stega";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  IconArrowRight,
  IconCircleCheck,
  IconLoader2,
  IconAlertTriangle,
  IconTruck,
} from "@tabler/icons-react";

export interface ContactFormLabels {
  contactSectionTitle?: string | null;
  needSectionTitle?: string | null;
  detailsSectionTitle?: string | null;
  nameLabel?: string | null;
  namePlaceholder?: string | null;
  emailLabel?: string | null;
  emailPlaceholder?: string | null;
  phoneLabel?: string | null;
  phonePlaceholder?: string | null;
  categoryLabel?: string | null;
  categoryPlaceholder?: string | null;
  dateRangeLabel?: string | null;
  dateStartA11yLabel?: string | null;
  dateEndA11yLabel?: string | null;
  deliveryLabel?: string | null;
  deliveryDescription?: string | null;
  messageLabel?: string | null;
  messagePlaceholder?: string | null;
  submitLabel?: string | null;
  submitLoadingLabel?: string | null;
  submitDisclaimer?: string | null;
  successTitle?: string | null;
  successMessage?: string | null;
  successNewRequestLabel?: string | null;
  genericError?: string | null;
}

interface Props {
  categories: { name: string; slug: string }[];
  labels: ContactFormLabels;
}

const inputClass =
  "h-11 rounded-lg border-border/60 bg-background px-3.5 text-[0.95rem]";

const labelClass =
  "font-heading text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-primary/80";

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-brand-accent ml-0.5 font-semibold">
      *
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading text-primary mb-4 text-base font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export default function ContactForm({ categories, labels }: Props) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const text = {
    contactSectionTitle: stegaClean(labels.contactSectionTitle ?? ""),
    needSectionTitle: stegaClean(labels.needSectionTitle ?? ""),
    detailsSectionTitle: stegaClean(labels.detailsSectionTitle ?? ""),
    nameLabel: stegaClean(labels.nameLabel ?? ""),
    namePlaceholder: stegaClean(labels.namePlaceholder ?? ""),
    emailLabel: stegaClean(labels.emailLabel ?? ""),
    emailPlaceholder: stegaClean(labels.emailPlaceholder ?? ""),
    phoneLabel: stegaClean(labels.phoneLabel ?? ""),
    phonePlaceholder: stegaClean(labels.phonePlaceholder ?? ""),
    categoryLabel: stegaClean(labels.categoryLabel ?? ""),
    categoryPlaceholder: stegaClean(labels.categoryPlaceholder ?? ""),
    dateRangeLabel: stegaClean(labels.dateRangeLabel ?? ""),
    dateStartA11yLabel: stegaClean(labels.dateStartA11yLabel ?? ""),
    dateEndA11yLabel: stegaClean(labels.dateEndA11yLabel ?? ""),
    deliveryLabel: stegaClean(labels.deliveryLabel ?? ""),
    deliveryDescription: stegaClean(labels.deliveryDescription ?? ""),
    messageLabel: stegaClean(labels.messageLabel ?? ""),
    messagePlaceholder: stegaClean(labels.messagePlaceholder ?? ""),
    submitLabel: stegaClean(labels.submitLabel ?? ""),
    submitLoadingLabel: stegaClean(labels.submitLoadingLabel ?? ""),
    submitDisclaimer: stegaClean(labels.submitDisclaimer ?? ""),
    successTitle: stegaClean(labels.successTitle ?? ""),
    successMessage: stegaClean(labels.successMessage ?? ""),
    successNewRequestLabel: stegaClean(labels.successNewRequestLabel ?? ""),
    genericError: stegaClean(labels.genericError ?? ""),
  };

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
      delivery: true,
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
      <div className="bg-secondary/40 border-border/60 rounded-2xl border p-10 text-center">
        <div className="bg-brand-accent/10 mx-auto flex size-16 items-center justify-center rounded-full">
          <IconCircleCheck className="text-brand-accent size-9" stroke={1.6} />
        </div>

        <h3 className="font-heading text-primary mt-6 text-2xl font-semibold tracking-tight">
          {text.successTitle}
        </h3>
        <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-sm leading-relaxed">
          {text.successMessage}
        </p>

        <Button
          variant="subtle"
          size="sm"
          onClick={() => setStatus("idle")}
          className="mt-7"
        >
          {text.successNewRequestLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-secondary/40 border-border/60 rounded-2xl border">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-7 p-6 sm:p-7"
        noValidate
      >
        {status === "error" && (
          <div
            role="alert"
            className="border-destructive/30 bg-destructive/5 text-destructive flex items-start gap-3 rounded-xl border p-4 text-sm"
          >
            <IconAlertTriangle
              className="mt-0.5 size-4 shrink-0"
              stroke={1.8}
            />
            <span>{errorMessage || text.genericError}</span>
          </div>
        )}

        <section>
          <SectionTitle>{text.contactSectionTitle}</SectionTitle>

          <div className="max-w-2xl space-y-4">
            <Field data-invalid={!!errors.name} className="max-w-md">
              <FieldLabel htmlFor="name" className={labelClass}>
                {text.nameLabel}
                <RequiredMark />
              </FieldLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder={text.namePlaceholder}
                    aria-invalid={!!errors.name}
                    aria-required="true"
                    className={inputClass}
                    {...field}
                  />
                )}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email" className={labelClass}>
                  {text.emailLabel}
                  <RequiredMark />
                </FieldLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder={text.emailPlaceholder}
                      aria-invalid={!!errors.email}
                      aria-required="true"
                      className={inputClass}
                      {...field}
                    />
                  )}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone" className={labelClass}>
                  {text.phoneLabel}
                  <RequiredMark />
                </FieldLabel>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={text.phonePlaceholder}
                      aria-invalid={!!errors.phone}
                      aria-required="true"
                      className={inputClass}
                      {...field}
                    />
                  )}
                />
                <FieldError>{errors.phone?.message}</FieldError>
              </Field>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>{text.needSectionTitle}</SectionTitle>

          <div className="max-w-2xl space-y-4">
            <Field data-invalid={!!errors.category} className="max-w-md">
              <FieldLabel htmlFor="category" className={labelClass}>
                {text.categoryLabel}
              </FieldLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="category"
                      className="border-border/60 bg-background h-11 w-full rounded-lg px-3.5 text-[0.95rem]"
                      aria-invalid={!!errors.category}
                    >
                      <SelectValue placeholder={text.categoryPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => {
                        const slug = stegaClean(cat.slug);
                        const name = stegaClean(cat.name);
                        return (
                          <SelectItem key={slug} value={slug}>
                            {name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.category?.message}</FieldError>
            </Field>

            {/* Date range as a single composite field */}
            <div className="max-w-md">
              <div className={`${labelClass} mb-2`}>{text.dateRangeLabel}</div>
              <div
                data-invalid={!!errors.dateStart || !!errors.dateEnd}
                className="border-border/60 bg-background data-[invalid=true]:border-destructive/60 grid grid-cols-[1fr_auto_1fr] items-center gap-1 rounded-lg border"
              >
                <Controller
                  name="dateStart"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="dateStart"
                      type="date"
                      aria-label={text.dateStartA11yLabel}
                      aria-invalid={!!errors.dateStart}
                      className="font-body text-foreground placeholder:text-muted-foreground/60 h-11 w-full rounded-l-lg border-0 bg-transparent px-3.5 text-[0.95rem] tabular-nums [color-scheme:light] outline-none"
                      {...field}
                    />
                  )}
                />

                <div
                  aria-hidden="true"
                  className="text-muted-foreground flex h-7 items-center justify-center px-2"
                >
                  <IconArrowRight className="size-3.5" stroke={2} />
                </div>

                <Controller
                  name="dateEnd"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="dateEnd"
                      type="date"
                      aria-label={text.dateEndA11yLabel}
                      aria-invalid={!!errors.dateEnd}
                      className="font-body text-foreground placeholder:text-muted-foreground/60 h-11 w-full rounded-r-lg border-0 bg-transparent px-3.5 text-right text-[0.95rem] tabular-nums [color-scheme:light] outline-none"
                      {...field}
                    />
                  )}
                />
              </div>
              {(errors.dateStart || errors.dateEnd) && (
                <p
                  role="alert"
                  className="text-destructive mt-1.5 text-sm font-normal"
                >
                  {errors.dateStart?.message ?? errors.dateEnd?.message}
                </p>
              )}
            </div>

            <Controller
              name="delivery"
              control={control}
              render={({ field }) => (
                <label
                  htmlFor="delivery"
                  className="border-border/60 bg-background hover:border-border has-data-checked:border-primary/40 has-data-checked:bg-primary/5 flex max-w-md cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors"
                >
                  <Checkbox
                    id="delivery"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <IconTruck
                        size={18}
                        stroke={1.8}
                        className="text-primary"
                      />
                      <span className="text-foreground text-sm font-semibold">
                        {text.deliveryLabel}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {text.deliveryDescription}
                    </p>
                  </div>
                </label>
              )}
            />
          </div>
        </section>

        <section>
          <SectionTitle>{text.detailsSectionTitle}</SectionTitle>

          <Field data-invalid={!!errors.message} className="max-w-2xl">
            <FieldLabel htmlFor="message" className={labelClass}>
              {text.messageLabel}
              <RequiredMark />
            </FieldLabel>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="message"
                  placeholder={text.messagePlaceholder}
                  rows={5}
                  aria-invalid={!!errors.message}
                  aria-required="true"
                  className="border-border/60 bg-background resize-none rounded-lg px-3.5 py-3 text-[0.95rem] leading-relaxed"
                  {...field}
                />
              )}
            />
            <FieldError>{errors.message?.message}</FieldError>
          </Field>
        </section>

        {/* Honeypot */}
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

        <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
            {text.submitDisclaimer}
          </p>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <IconLoader2
                  className="animate-spin"
                  data-icon="inline-start"
                />
                {text.submitLoadingLabel}
              </>
            ) : (
              <>
                {text.submitLabel}
                <IconArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

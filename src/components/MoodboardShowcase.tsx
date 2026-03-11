import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  IconArmchair,
  IconSun,
  IconSpeakerphone,
  IconToolsKitchen2,
  IconConfetti,
  IconMoodKid,
  IconPlant,
  IconHammer,
  IconLuggage,
  IconPhone,
  IconMail,
  IconMapPin,
  IconArrowRight,
  IconStar,
  IconHeart,
  IconSearch,
  IconCalendar,
  IconTruck,
  IconShieldCheck,
} from "@tabler/icons-react";

const categories = [
  { icon: IconArmchair, name: "Mobilier", desc: "Tables, chaises, déco" },
  { icon: IconSun, name: "Plein air", desc: "Tentes, parasols, barnums" },
  {
    icon: IconSpeakerphone,
    name: "Image & Son",
    desc: "Enceintes, micros, écrans",
  },
  {
    icon: IconToolsKitchen2,
    name: "Gourmand",
    desc: "Machines à crêpes, barbe à papa",
  },
  {
    icon: IconConfetti,
    name: "Divertissement",
    desc: "Jeux, animations, photo",
  },
  { icon: IconMoodKid, name: "Kids", desc: "Châteaux gonflables, jeux" },
  {
    icon: IconPlant,
    name: "Jardinage",
    desc: "Tondeuses, taille-haies, outils",
  },
  {
    icon: IconHammer,
    name: "Entretien & Rénovation",
    desc: "Perceuses, échafaudages",
  },
  { icon: IconLuggage, name: "Voyage", desc: "Remorques, porte-vélos" },
];

export default function MoodboardShowcase() {
  return (
    <div className="space-y-16">
      {/* Buttons */}
      <section className="space-y-8">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            03 — Composants UI
          </p>
          <Separator />
        </div>

        <div className="space-y-6">
          <p className="text-brand-accent text-xs font-medium tracking-wider uppercase">
            Boutons
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">
              Demander un devis
              <IconArrowRight data-icon="inline-end" size={16} />
            </Button>
            <Button variant="subtle" size="lg">
              Voir le catalogue
            </Button>
            <Button variant="secondary">En savoir plus</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Lien texte</Button>
            <Button size="lg" variant="accent">
              CTA Orange
              <IconArrowRight data-icon="inline-end" size={16} />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon-sm" variant="subtle">
              <IconPhone size={16} />
            </Button>
            <Button size="icon-sm" variant="subtle">
              <IconMail size={16} />
            </Button>
            <Button size="icon-sm" variant="subtle">
              <IconMapPin size={16} />
            </Button>
            <Button size="icon-sm" variant="subtle">
              <IconSearch size={16} />
            </Button>
            <Button size="icon-sm" variant="subtle">
              <IconCalendar size={16} />
            </Button>
            <Button size="icon-sm" variant="subtle">
              <IconHeart size={16} />
            </Button>
            <Button size="icon-sm" variant="subtle">
              <IconStar size={16} />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-6">
          <p className="text-brand-accent text-xs font-medium tracking-wider uppercase">
            Badges
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Mobilier</Badge>
            <Badge variant="secondary">Plein air</Badge>
            <Badge variant="outline">Image & Son</Badge>
            <Badge variant="accent">Nouveau</Badge>
            <Badge variant="secondary">Gourmand</Badge>
            <Badge variant="outline">Divertissement</Badge>
            <Badge>Kids</Badge>
            <Badge variant="secondary">Jardinage</Badge>
            <Badge variant="outline">Rénovation</Badge>
            <Badge variant="destructive">Indisponible</Badge>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-6">
          <p className="text-brand-accent text-xs font-medium tracking-wider uppercase">
            Champs
          </p>
          <div className="flex max-w-md flex-col gap-3">
            <Input placeholder="Rechercher un équipement..." />
            <div className="flex gap-2">
              <Input placeholder="Votre email" />
              <Button variant="accent">Envoyer</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="space-y-8">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            04 — Icônes (Tabler)
          </p>
          <Separator />
        </div>

        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-9">
          {categories.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="border-border bg-card hover:border-brand-accent/30 hover:bg-brand-accent/5 flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors"
            >
              <Icon size={28} className="text-primary" />
              <p className="text-muted-foreground text-xs">{name}</p>
            </div>
          ))}
        </div>

        <p className="text-brand-accent text-xs font-medium tracking-wider uppercase">
          Icônes utilitaires
        </p>
        <div className="flex flex-wrap gap-6">
          {[
            { icon: IconPhone, label: "Téléphone" },
            { icon: IconMail, label: "Email" },
            { icon: IconMapPin, label: "Adresse" },
            { icon: IconCalendar, label: "Réservation" },
            { icon: IconTruck, label: "Livraison" },
            { icon: IconShieldCheck, label: "Garantie" },
            { icon: IconStar, label: "Avis" },
            { icon: IconHeart, label: "Favoris" },
            { icon: IconSearch, label: "Recherche" },
            { icon: IconArrowRight, label: "Flèche" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <Icon size={22} className="text-muted-foreground" />
              <p className="text-muted-foreground text-xs">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-8">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            05 — Cartes produit
          </p>
          <Separator />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {categories.slice(0, 3).map(({ icon: Icon, name, desc }) => (
            <Card key={name} className="transition-shadow hover:shadow-md">
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="bg-brand-accent/10 flex size-10 items-center justify-center rounded-lg">
                    <Icon size={20} className="text-brand-accent" />
                  </div>
                  <div>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Pack Anniversaire
              </CardTitle>
              <CardDescription>
                Tout ce qu'il faut pour un anniversaire réussi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Mobilier</Badge>
                <Badge variant="secondary">Divertissement</Badge>
                <Badge variant="secondary">Gourmand</Badge>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-heading text-primary text-2xl font-bold">
                  À partir de 89€
                </p>
                <Button size="sm" variant="accent">
                  Réserver
                  <IconArrowRight data-icon="inline-end" size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Pack Mariage
              </CardTitle>
              <CardDescription>
                Élégance et confort pour votre grand jour
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Mobilier</Badge>
                <Badge variant="secondary">Plein air</Badge>
                <Badge variant="secondary">Image & Son</Badge>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="font-heading text-primary text-2xl font-bold">
                  À partir de 249€
                </p>
                <Button size="sm" variant="accent">
                  Réserver
                  <IconArrowRight data-icon="inline-end" size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hero preview */}
      <section className="space-y-8">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            06 — Aperçu Hero
          </p>
          <Separator />
        </div>

        <div className="bg-primary ring-foreground/5 overflow-hidden rounded-2xl px-8 py-16 text-center ring-1 md:px-16 md:py-24">
          <p className="text-xs font-medium tracking-widest text-white/50 uppercase">
            Location d'équipement
          </p>
          <h2 className="font-heading mt-4 text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl">
            Tout ce qu'il vous faut,
            <br />
            <span className="text-brand-accent">sans l'acheter.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-white/70">
            Mobilier, son & image, plein air, divertissement — Fidéloc met à
            votre disposition un catalogue complet pour vos événements et
            projets.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" variant="accent">
              Voir le catalogue
              <IconArrowRight data-icon="inline-end" size={16} />
            </Button>
            <Button size="lg" variant="outline">
              Demander un devis
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface CategoryItem {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}

interface CategoryCarouselProps {
  categories: CategoryItem[];
}

export default function CategoryCarousel({
  categories,
}: CategoryCarouselProps) {
  if (!categories.length) {
    return <p className="text-muted-foreground"></p>;
  }

  return (
    <Carousel opts={{ align: "start" }} className="group/carousel -mx-2">
      <CarouselContent className="-ml-4">
        {categories.map((cat) => (
          <CarouselItem
            key={cat.slug}
            className="basis-[280px] pl-4 sm:basis-[320px] lg:basis-[360px]"
          >
            <a
              href={`/produits/${cat.slug}`}
              className="group/card relative block aspect-4/3 overflow-hidden rounded-xl"
            >
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                />
              ) : (
                <div className="bg-muted absolute inset-0" />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative flex h-full flex-col justify-end p-5">
                <h3 className="font-heading text-lg leading-tight font-semibold text-white">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-snug text-white/70">
                    {cat.description}
                  </p>
                )}
              </div>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

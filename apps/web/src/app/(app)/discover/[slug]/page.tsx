import Link from "next/link";

import { findNeighborhoodBySlug } from "../neighborhood-data";

type DiscoverNeighborhoodPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DiscoverNeighborhoodPage({ params }: DiscoverNeighborhoodPageProps) {
  const { slug } = await params;
  const neighborhood = findNeighborhoodBySlug(slug);

  if (!neighborhood) {
    return (
      <section className="max-w-3xl">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-3">
          Neighborhood not found
        </h1>
        <p className="text-charcoal-600 mb-6">
          We could not find that neighborhood yet. Browse available stories from discover.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center text-sm font-medium text-terracotta-600 hover:underline"
        >
          Back to Discover
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-3xl">
      <Link
        href="/discover"
        className="inline-flex items-center text-sm font-medium text-terracotta-600 hover:underline mb-6"
      >
        Back to Discover
      </Link>

      <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-2">
        {neighborhood.name}
      </h1>
      <p className="text-charcoal-500 mb-8">{neighborhood.city}</p>

      <blockquote className="font-serif text-charcoal-700 italic leading-relaxed border-l-4 border-terracotta-200 pl-5 mb-8">
        &ldquo;{neighborhood.story}&rdquo;
      </blockquote>

      <div className="flex flex-wrap gap-2 mb-4">
        {neighborhood.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 text-xs font-medium rounded-lg bg-sage-50 text-sage-600">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm text-charcoal-500">
        {neighborhood.storyCount} resident stories in this neighborhood.
      </p>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { getNeighborhoodHref, neighborhoods } from "./neighborhood-data";

export const dynamic = "force-dynamic";

export default function DiscoverPage() {
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const preferenceOptions = [
    "Walkable streets",
    "Yard space",
    "Quiet streets",
    "Community gardens",
    "Close to nature",
    "Family-friendly",
    "Arts & culture",
    "Local shops",
    "Diverse community",
  ];

  const filteredNeighborhoods = useMemo(() => {
    if (selectedPrefs.length === 0) return neighborhoods;

    return neighborhoods.filter((neighborhood) =>
      selectedPrefs.every((pref) =>
        neighborhood.tags.some(
          (tag) => tag.toLowerCase() === pref.toLowerCase(),
        ),
      ),
    );
  }, [selectedPrefs]);

  const togglePreference = (pref: string) => {
    setSelectedPrefs((current) =>
      current.includes(pref)
        ? current.filter((item) => item !== pref)
        : [...current, pref],
    );
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-2">
          Discover
        </h1>
        <p className="text-charcoal-500 text-lg">
          Explore neighborhoods through the stories of the people who live there.
        </p>
      </div>

      {/* Preference chips */}
      <div className="mb-10">
        <p className="text-sm font-medium text-charcoal-600 mb-3">
          What draws you to a neighborhood?
        </p>
        <div className="flex flex-wrap gap-2">
          {preferenceOptions.map((pref) => {
            const selected = selectedPrefs.includes(pref);
            return (
            <button
              key={pref}
              type="button"
              onClick={() => togglePreference(pref)}
              aria-pressed={selected}
              className="px-4 py-2 text-sm rounded-xl border border-charcoal-200 text-charcoal-600 hover:border-terracotta-400 hover:text-terracotta-600 hover:bg-terracotta-50 transition-colors"
              data-selected={selected ? "true" : "false"}
            >
              {pref}
            </button>
            );
          })}
        </div>
      </div>

      {/* Neighborhood cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredNeighborhoods.map((n) => (
          <Link
            key={n.name}
            href={getNeighborhoodHref(n.name)}
            aria-label={`Explore neighborhood: ${n.name}`}
            className="bg-white rounded-2xl p-8 shadow-soft border border-charcoal-50 hover:shadow-soft-lg transition-shadow group cursor-pointer"
          >
            {/* Warm accent bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-terracotta-100 flex items-center justify-center">
                <span className="text-terracotta-600 text-sm font-bold">
                  {n.name[0]}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                  {n.name}
                </h3>
                <p className="text-sm text-charcoal-400">{n.city}</p>
              </div>
            </div>

            <p className="font-serif text-charcoal-700 italic leading-relaxed mb-5">
              &ldquo;{n.story}&rdquo;
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {n.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-sage-50 text-sage-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal-400">
                {n.storyCount} resident stories
              </span>
              <span className="text-sm font-medium text-terracotta-500 group-hover:underline">
                Explore neighborhood
              </span>
            </div>
          </Link>
        ))}
      </div>
      {filteredNeighborhoods.length === 0 ? (
        <p className="mt-6 text-sm text-charcoal-500">
          No neighborhoods match all selected preferences yet.
        </p>
      ) : null}
    </div>
  );
}

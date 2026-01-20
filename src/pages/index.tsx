"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  NamedAPIResource,
  Pokemon,
  PokemonListResponse,
  PokemonTypeResponse,
} from "@/types/pokemon";

const PAGE_SIZE = 24;

/* ===================================================== */

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page")) || 1;
  const typeParam = searchParams.get("type");

  const [total, setTotal] = useState<number>(0);
  const [types, setTypes] = useState<NamedAPIResource[]>([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=0")
      .then((res) => res.json() as Promise<PokemonListResponse>)
      .then((data) => setTotal(data.count));

    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json() as Promise<{ results: NamedAPIResource[] }>)
      .then((data) => setTypes(data.results));
  }, []);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`/?${params.toString()}`);
  };

  const setType = (type: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type) {
      params.set("type", type);
      params.set("page", "1");
    } else {
      params.delete("type");
      params.set("page", "1");
    }

    router.replace(`/?${params.toString()}`);
  };

  return (
    <main className="min-h-screen p-8 space-y-6">
      <header>
        <h1 className="text-4xl font-bold">
          Welcome to Pokemon world
        </h1>
        <p className="text-xl mt-2">
          <strong>Total count:</strong> {total}
        </p>
      </header>

      <TypeSelector
        types={types}
        selectedType={typeParam}
        onSelect={setType}
      />

      {typeParam ? (
        <TypePokemonList
          typeName={typeParam}
          page={pageParam}
          onPageChange={setPage}
        />
      ) : (
        <DefaultPokemonList
          total={total}
          page={pageParam}
          onPageChange={setPage}
        />
      )}
    </main>
  );
}

/* ===================================================== */

function TypeSelector({
  types,
  selectedType,
  onSelect,
}: {
  types: NamedAPIResource[];
  selectedType: string | null;
  onSelect: (type: string | null) => void;
}) {
  return (
    <section>
      <strong>Types:</strong>
      <div className="flex flex-wrap gap-2 mt-2">
        {types.map((t) => (
          <button
            key={t.name}
            onClick={() => onSelect(t.name)}
            className={`px-3 py-1 border rounded ${
              selectedType === t.name
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {t.name}
          </button>
        ))}

        {selectedType && (
          <button
            onClick={() => onSelect(null)}
            className="px-3 py-1 border rounded bg-gray-200"
          >
            Clear
          </button>
        )}
      </div>
    </section>
  );
}

/* ===================================================== */
/* Default mode */

function DefaultPokemonList({
  total,
  page,
  onPageChange,
}: {
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}) {
  const [list, setList] = useState<NamedAPIResource[]>([]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    const offset = (page - 1) * PAGE_SIZE;

    fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
    )
      .then((res) => res.json() as Promise<PokemonListResponse>)
      .then((data) => setList(data.results));
  }, [page]);

  return (
    <PokemonGrid
      title="All Pokémon"
      subtitle={`Page ${page} / ${totalPages}`}
      items={list}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}

/* ===================================================== */
/* Type mode */

function TypePokemonList({
  typeName,
  page,
  onPageChange,
}: {
  typeName: string;
  page: number;
  onPageChange: (page: number) => void;
}) {
  const [list, setList] = useState<NamedAPIResource[]>([]);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
      .then((res) => res.json() as Promise<PokemonTypeResponse>)
      .then((data) =>
        setList(data.pokemon.map((p) => p.pokemon))
      );
  }, [typeName]);

  const totalPages = Math.ceil(list.length / PAGE_SIZE);

  const pagedList = useMemo(
    () =>
      list.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      ),
    [list, page]
  );

  return (
    <PokemonGrid
      title={`Selected type: ${typeName}`}
      subtitle={`Page ${page} / ${totalPages}`}
      items={pagedList}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}

/* ===================================================== */
/* Shared UI */

function PokemonGrid({
  title,
  subtitle,
  items,
  page,
  totalPages,
  onPageChange,
}: {
  title: string;
  subtitle: string;
  items: NamedAPIResource[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <PokemonCard key={p.name} url={p.url} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={onPageChange}
      />
    </section>
  );
}

function PokemonCard({ url }: { url: string }) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json() as Promise<Pokemon>)
      .then(setPokemon);
  }, [url]);

  if (!pokemon) {
    return (
      <div className="border p-4 rounded text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="border p-4 rounded flex flex-col items-center">
      {pokemon.sprites.front_default && (
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-20 h-20"
        />
      )}
      <div className="mt-2 font-semibold">
        #{pokemon.id} {pokemon.name}
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm">
        {page} / {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: NamedAPIResource[];
}

export interface PokemonTypeResponse {
  pokemon: {
    pokemon: NamedAPIResource;
    slot: number;
  }[];
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
}

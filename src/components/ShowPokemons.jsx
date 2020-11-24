import React from "react";
import axios from "axios";
import Card from "./Card";
import { useInfiniteQuery } from "react-query";

function ShowPokemons() {
  const loadMoreButtonRef = React.useRef();
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    "pokemons",
    async (key, url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=5`) => {
      const { data } = await axios.get(url);
      return data;
    },
    {
      getFetchMore: (lastGroup) => {
        return lastGroup.next;
      },
    }
  );

  const PokemonCard = (pokemon) => {
    return (
      <Card key={pokemon.name} name={pokemon.name} url={pokemon.url}></Card>
    );
  };
  return (
    <div>
      {status === "loading" && <div>Loading...</div>}
      {status === "error" && <div>Error {error.message}</div>}
      {status === "success" && (
        <>
          {data.map((page, i) => (
            <div style={{width: '150px', margin: 'auto'}} key={i}>
              {page.results.map((pokemon) => PokemonCard(pokemon))}
            </div>
          ))}
            <button
              ref={loadMoreButtonRef}
              onClick={() => fetchMore()}
              disabled={!canFetchMore || isFetchingMore}
            >
              {isFetchingMore
                ? "Loading more..."
                : canFetchMore
                ? "Load More"
                : "Nothing more to load"}
            </button>
            {isFetching && !isFetchingMore ? "Background Updating..." : null}
        </>
      )}
    </div>
  );
}

export default ShowPokemons;

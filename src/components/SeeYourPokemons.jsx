import React from "react";
import { useQuery, useQueryCache, useMutation } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { getItems, createItem } from "./api/data";

export default function SeeYourPokemons() {
  const cache = useQueryCache();
  const [text, setText] = React.useState("");
  const { status, data, error, isFetching } = useQuery(
    "myPokemons",
    async () => {
      const data = await getItems();
      return data;
    }
  );

  const [mutateAddPokemon, { mutationError, reset }] = useMutation(
    (text) => createItem(text),
    {
      // Optimistically update the cache value on mutate, but store
      // the old value and return it so that it's accessible in case of
      // an error
      onMutate: (text) => {
        setText("");
        cache.cancelQueries("myPokemons");

        const previousValue = cache.getQueryData("myPokemons");

        cache.setQueryData("myPokemons", (old) => ({
          ...old,
          ts: Date.now(),
          items: [...(old?.items || []), text],
        }));

        return previousValue || [];
      },
      // On failure, roll back to the previous value
      onError: (err, variables, previousValue) => {
        alert(`${err.message} ${variables}, render the previous value`);
        // After success or failure, refetch the myPokemons query if previous value is not undefined
        cache.setQueryData("myPokemons", previousValue);
      },
      onSettled: () => {
        cache.invalidateQueries("myPokemons");
      },
    }
  );

  return (
    <div>
      <p>
        In this example, new items can be created using a mutation. The new item
        will be optimistically added to the list in hopes that the server
        accepts the item. If it does, the list is refetched with the true items
        from the list. Every now and then, the mutation may fail though. When
        that happens, the previous list of items is restored and the list is
        again refetched from the server.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutateAddPokemon(text);
        }}
      >
        <input
          type="text"
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <button>Create</button>
      </form>
      <br />
      {status === "loading" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Request cancelled or failed</div>
      ) : (
        <>
          <div>Updated At: {new Date(data.ts).toLocaleTimeString()}</div>
          <ul>
            {data.items.map((datum) => (
              <li key={datum}>{datum}</li>
            ))}
          </ul>
          <div>{isFetching ? "Updating in background..." : " "}</div>
        </>
      )}
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}

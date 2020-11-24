# React-Query-Demo
This is a project based on react query

## React Query

React Query is one of the state management tools which takes a different approach from Flux, Redux, and Mobx. It introduces the key concepts of Client State and Server State. This makes React Query one of the best libraries to manage state since all other state management patterns address only the client state and find it difficult to handle the server state that needs to be fetched, listened, or subscribed.

You can cache the data from a server request. React query caches that data and when you need them again, you get it right away and at the same time React Query performs a background fetch in order to get the latest data from the server.
Provides easy ways to update the date you have stored in the cache (they stay there for 5 minutes).
Their github has a great documentation. 


#### Key features: 
* useQuery: Hook used for GET requests
* useMutation: POST, PUT, DELETE
* queryCache: the cache instance object that can be used to interfere with the cache

#### Extra features: 
* Backend agnostic (anything that returns a promise)
* Garbage collection (data is removed from the cache when cacheTime ends)
* Polling mechanism (Refetch interval can be set in query options)
* Suspense ready (suspense for data fetching can be enabled globally)
* Infinite scrolling (useInfiniteQuery hook exposed by the API, for infinite scrolling tables)
* Query cancellation (easy to implement with axios and fetch)
* Server side rendering
* Prefetching data (fetch data before actually need them)


#### React-Query vs Redux
* Less boilerplate code
* You dont need to have the whole backend state in your head (maybe with typescript you have to, but its ok :P )
* You can cache, refresh and invalidate data, in contrast redux which simply loads the data and stores it in the global store on load. 
* When the data fetching/caching part of your app is taken care of, there is very little global state for you to handle on the frontend
* You can't share global state, you can handle it with context or useContext and useReducer. 

### Let’s get started

#### Installing react-query 

```node
npm install react-query react-query-devtools axios --save
```

#### Configuring Dev Tools

```javascript
import { ReactQueryDevtools } from "react-query-devtools";

function App() {
  return (
    <>
      {/* The rest of your application components */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

When we configure the React Query devtools you can see the React Query logo on the left bottom of your application.


Devtools help us to see how the data flow happens inside the application just like redux devtools. This really helps to reduce the time in debugging the app.

#### useQuery
We will start with useQuery which takes a unique key and a function which is responsible for fetching data.

In the following code we just get the data from a specific Pokemon using useQuery and the the fetchPokemonDetails function which is responsible for fetching the data.
Keep in mind that useQuery returns status, data and error, so there is no need for error handling when sending the request.

```javascript
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
 
const fetchPokemonDetails = async (_, url) => {
 const { data } = await axios.get(url);
 return data;
};
 
export default function Pokemon({ url }) {
 const classes = useStyles();
 
 const { data, status } = useQuery(
   ["pokemonDetails", url],
   fetchPokemonDetails
 );
  return (
   <>
     {status === "loading" && <div>Loading...</div>}
     {status === "error" && <div>Something went wrong...</div>}
     {status === "success" && (
       {/*Your code here*/|
     )}
   </>
 );
}
```

As you can see the useQuery returns the data and status which can be used to display Loaders, Error messages, and the actual Data. By default, the React Query will only request data when it is stale or old.

React Query caches the data so that it won't render the components unless there is a change. We can also use some special config with useQuery in order to refresh data in the background.

```javascript
 const { data, status } = useQuery(
   ["pokemonDetails", url],
   fetchPokemonDetails, {
staleTime:5000, cacheTime: 500
    }
 );
```

The above config will make React Query fetch data every 5 seconds in the background. 
We can also set a cacheTime and a retryTime which defines the time that the browser should keep the cache and the number of attempts that it should fetch data on fails.

#### useInfiniteQuery

Rendering lists that can additively "load more" data onto an existing set of data or "infinite scroll" is also a very common UI pattern. React Query supports a useful version of useQuery called useInfiniteQuery for querying these types of lists.

There are some differences between useQuery and useInfiniteQuery.
Now the data is now an array of arrays that contain query group results, instead of the query results themselves
A fetchMore function is now available
A getFetchMore option is available for both determining if there is more data to load and the information to fetch it. 
A canFetchMore boolean is now available and is true if getFetchMore returns a truthy value
An isFetchingMore boolean is now available to distinguish between a background refresh state and a loading more state

So let's get them all.

```javascript
import React from "react";
import axios from "axios";
import { useInfiniteQuery, useQueryCache } from "react-query";
 
function Main() {
 const loadMoreButtonRef = React.useRef();
 const {status,data,error,isFetching,isFetchingMore,fetchMore,   canFetchMore,
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
 
 return (
   <div>
     {...}
     {status === "loading" && <div>Loading...</div>}
     {status === "error" && <div>Error {error.message}</div>}
     {status === "success" && (
       {…}
             {data.map((page, i) => (
               <React.Fragment key={i}>
                 {page.results.map((pokemon) => PokemonCard(pokemon))}
               </React.Fragment>
             ))}
             <div>
               <button
                 onClick={() => fetchMore()}
                 disabled={!canFetchMore || isFetchingMore}
               >
                 {isFetchingMore
                   ? "Loading more..."
                   : canFetchMore
                   ? "Load More"
                   : "Nothing more to load"}
               </button>
             </div>
             <div>
               {isFetching && !isFetchingMore
                 ? "Background Updating..."
                 : null}
             </div>
           </>
         }
       </div>
     )}
   </div>
 );
}
 
export default Main;
```

The first time we give 5 as an offset in order to get the first 5 pokemons. The getFetchMore function returns the next url in order to get the next data. We could use just offset, it depends on the response of the endpoint. 
In order to get the next group of data we call the fetchMore function.

#### useMutation
Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, React Query exports a useMutation hook.

```javascript
const [
   mutate,
   { status, isIdle, isLoading, isSuccess, isError, data, error, reset },
 ] = useMutation(mutationFn, {
   onMutate,
   onSuccess,
   onError,
   onSettled,
   throwOnError,
   useErrorBoundary,
 })

const promise = mutate(variables, {
   onSuccess,
   onSettled,
   onError,
   throwOnError,
 })
```


useMutation offers plenty of functions. In more details

onMutate:
This function will fire before the mutation function is fired and is passed the same variables the mutation function would receive
Useful to perform optimistic updates to a resource in hopes that the mutation succeeds
 onSuccess:
This function will fire when the mutation is successful and will be passed the mutation's result.
Fires after the mutate-level onSuccess handler (if it is defined)
onError:
This function will fire if the mutation encounters an error and will be passed the error.
Fires after the mutate-level onError handler (if it is defined)

onSettled:
This function will fire when the mutation is either successfully fetched or encounters an error and be passed either the data or error
Fires after the mutate-level onSettled handler (if it is defined)

Ok now lets give me some code. 
Let's say that we want to create a form that contains the Pokemons of a user and the user has the option to Add more pokemons in that list. 

First we will get the user’s pokemons

```javascript
 const { status, data, error, isFetching } = useQuery(
   "myPokemons",
   async () => {
     const data = await getItems();
     return data;
   }
 );
```

Then, when the user want to update its list, by adding a new pokemon we need useMutation 
 
 ```javascript
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
        // After success or failure, refetch the myPokemons query
        cache.setQueryData("myPokemons", previousValue);
      },
      onSettled: () => {
        cache.invalidateQueries("myPokemons");
      },
    }
  );
```

And now let's break the code down. 
useMutation gets a text props and is calling createItem function in order to send a request to the server. 
onMutation is fired before the mutation function. First we clear the input value, then we cancel the “myPokemons” queries that are performed and we get the previous value of the list from the cache in order to rollback to it if an error happens. Then we Optimistically update the cache value of the request and return the previous value. 
If an error happens the onError function will be triggered and we update the query value with the previous value. At onSettled, which will be triggered after success or failure, we invalidate the query in order to perform a new one. (Keep in mind that when we update a new query after an invalidation, the user don't see it because we updated optimistically the query’s value before)

#### Auto Refetching
With React-Query you can also fetch data every specific period of time by setting refetchInterval parameter at useQuery.  

```javascript
  const { status, data } = useQuery(
    "time",
    async () => {
      const { data } = await axios.get("http://worldtimeapi.org/api/timezone/Europe/Athens");
      return data;
    },
    {
      // Refetch the data every n seconds
      initialData: Date.now(),
      refetchInterval: intervalMs,
    }
  );
```

#### Important Defaults 
Now that we know the concepts of React-Query we have to explain some important defaults values.
Query results that are currently rendered on the screen (via useQuery and similar hooks) will become "stale" immediately after they are resolved and will be refetched automatically in the background when:
New instances of the query mount
The window is refocused
The network is reconnected.

To change this functionality, you can use options like refetchOnMount, refetchOnWindowFocus and refetchOnReconnect.


Query results that become unused (all instances of the query are unmounted) will still be cached in case they are used again for a default of 5 minutes before they are garbage collected.

To change this, you can alter the default cacheTime for queries to something other than 1000 * 60 * 5 milliseconds.


Queries that fail are silently retried 3 times, with exponential backoff delay before capturing and displaying an error to the UI.

To change this, you can alter the default retry and retryDelay options for queries to something other than 3 and the default exponential backoff function.


Query results by default are structurally shared to detect if data has actually changed and if not, the data reference remains unchanged to better help with value stabilization with regards to useMemo and useCallback.


#### Cache

React Query caching is automatic out of the box. It uses a stale-while-revalidate in-memory caching strategy and a very robust query deduping strategy to always ensure a query's data is always readily available, only cached when it's needed, even if that query is used multiple times across your application and updated in the background when possible.
At a glance:
* The cache is keyed on a deterministic hash of your query key.
* By default, query results become stale immediately after a successful fetch. This can be configured using the staleTime option at both the global and query-level.
* Stale queries are automatically refetched whenever their query keys change (this includes variables used in query key tuples), when they are freshly mounted from not having any instances on the page, or when they are refetched via the query cache manually.
* Though a query result may be stale, query results are by default always cached when in use.
* If and when a query is no longer being used, it becomes inactive and by default is cached in the background for 5 minutes. This time can be configured using the cacheTime option at both the global and query-level.
* After a query is inactive for the cacheTime specified (defaults to 5 minutes), the query is deleted and garbage collected.

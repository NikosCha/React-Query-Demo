import React, { useState } from "react";
import ShowPokemons from "./ShowPokemons";
import SeeYourPokemons from "./SeeYourPokemons";
import axios from "axios";
import { useQuery } from "react-query";

function Main() {
  const [show, setShow] = useState("allPokemons");
  const [intervalMs] = React.useState(5000);

  const { status, data } = useQuery(
    "time",
    async () => {
      const { data } = await axios.get("http://worldtimeapi.org/api/timezone/Europe/Athens");
      console.log(data)
      return data;
    },
    {
      // Refetch the data every n seconds
      initialData: Date.now(),
      refetchInterval: intervalMs,
    }
  );

  const onClick = () => {
    if (show === "allPokemons") {
      setShow("yourPokemons");
    } else if (show === "yourPokemons") {
      setShow("allPokemons");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Pokemons List</h1>
      <div>
        <span>This is updated every {intervalMs} ms: </span>
        {status === "success" && <span>{Date(data.unixtime)}</span>}
      </div>

      <button
        style={{ height: "45px", marginBottom: "50px", marginTop: "50px" }}
        onClick={onClick}
      >
        {show === "allPokemons" ? "See your own pokemons" : "See all pokemons"}
      </button>
      {show === "allPokemons" ? <ShowPokemons /> : <SeeYourPokemons />}
    </div>
  );
}

export default Main;

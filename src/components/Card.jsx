/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Pokemon from "./Pokemon";



function Card({ name, url }) {
  const [showPokemonDetails, setShowPokemonDetails] = useState(false);
  return (
    <div onClick={() => setShowPokemonDetails(!showPokemonDetails)}>
      <div style={{backgroundColor: "grey", width: '150px', height: '50px', textAlign: 'center', verticalAlign: "middle", marginBottom: '10px'}}>{name}</div>
      {showPokemonDetails && <Pokemon url={url} />}
    </div>
  );
}

export default Card;

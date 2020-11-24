// import { useMutation } from "react-query";
import axios from "axios";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { useQuery } from "react-query";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const fetchPokemonDetails = async (_, url) => {
  const { data } = await axios.get(url);
  return data;
};

export default function Pokemon({ url }) {
  const classes = useStyles();

  const { data, status } = useQuery(
    ["pokemonDetails", url],
    fetchPokemonDetails,{
      cacheTime: 500
    }
  );

  return (
    <>
      {status === "loading" && <div>Loading...</div>}
      {status === "error" && <div>Something went wrong...</div>}
      {status === "success" && (
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={data.sprites.front_default}
              title={data.forms[0].name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {data.forms[0].name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </>
  );
}

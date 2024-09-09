// import { Box, Button, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import MovieItem from "./Movies/MovieItem";
// import { Link } from "react-router-dom";
// import { getAllMovies } from "../api-helpers/api-helpers";

// const HomePage = () => {
//   const [movies, setMovies] = useState([]);
//   useEffect(() => {
//     getAllMovies()
//       .then((data) => setMovies(data.movies))
//       .catch((err) => console.log(err));
//   }, []);
//   return (
//     <Box width={"100%"} height="100%" margin="auto" marginTop={2}>
//       <Box margin={"auto"} width="80%" height={"40vh"} padding={2}>
//         <img
//           src="https://i.ytimg.com/vi/bweRG6WueuM/maxresdefault.jpg"
//           alt="Brahmastra"
//           width={"100%"}
//           height={"100%"}
//         />
//       </Box>
//       <Box padding={5} margin="auto">
//         <Typography variant="h4" textAlign={"center"}>
//           Latest Releases
//         </Typography>
//       </Box>
//       <Box
//         margin={"auto"}
//         display="flex"
//         width="80%"
//         justifyContent={"center"}
//         alignItems="center"
//         flexWrap="wrap"
//       >
//         {movies &&
//           movies
//             .slice(0, 4)
//             .map((movie, index) => (
//               <MovieItem
//                 id={movie.id}
//                 title={movie.title}
//                 posterUrl={movie.posterUrl}
//                 releaseDate={movie.releaseDate}
//                 key={index}
//               />
//             ))}
//       </Box>
//       <Box display="flex" padding={5} margin="auto">
//         <Button
//           LinkComponent={Link}
//           to="/movies"
//           variant="outlined"
//           sx={{ margin: "auto", color: "#2b2d42" }}
//         >
//           View All Movies
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default HomePage;


import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MovieItem from "./Movies/MovieItem";
import { Link } from "react-router-dom";
import { getAllMovies } from "../api-helpers/api-helpers";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  
  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box width={"100%"} height="100%" margin="auto" marginTop={2}>
      <Box margin={"auto"} width="80%" height={"40vh"} padding={2}>
        {/* Featured Movie Trailer */}
        {movies[0] && movies[0].trailerUrl && (
          <iframe
            width="100%"
            height="100%"
            src={movies[0].trailerUrl}
            title={movies[0].title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {/* Fallback Image if No Trailer */}
        {!movies[0]?.trailerUrl && (
          <img
            src="https://i.ytimg.com/vi/bweRG6WueuM/maxresdefault.jpg"
            // src="https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg"
            alt="Featured Movie"
            width={"100%"}
            height={"100%"}
          />
        )}
      </Box>
      
      <Box padding={5} margin="auto">
        <Typography variant="h4" textAlign={"center"}>
          Latest Releases
        </Typography>
      </Box>
      
      <Box
        margin={"auto"}
        display="flex"
        width="80%"
        justifyContent={"center"}
        alignItems="center"
        flexWrap="wrap"
      >
        {movies &&
          movies.slice(0, 4).map((movie, index) => (
            <MovieItem
              key={index}
              id={movie._id}
              title={movie.title}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              trailerUrl={movie.trailerUrl} // <-- Pass trailerUrl to MovieItem
            />
          ))}
      </Box>
      
      <Box display="flex" padding={5} margin="auto">
        <Button
          LinkComponent={Link}
          to="/movies"
          variant="outlined"
          sx={{ margin: "auto", color: "#2b2d42" }}
        >
          View All Movies
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;

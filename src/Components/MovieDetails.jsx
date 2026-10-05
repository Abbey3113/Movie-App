import { useEffect, useState } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import StarRating from "./StarRating";

function MovieDetails({ selectedID, KEY, watched, onCloseMovie, onAddWatch }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID,
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  useEffect(
    function () {
      async function fetchData() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`,
          );
          if (!res.ok) throw new Error("unable to fetch movie detail");
          const data = await res.json();
          setMovie(data);
          console.log(data);
        } catch (err) {
          console.log(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchData();
      console.log(selectedID);
    },
    [selectedID],
  );

  useEffect(function () {
    if (!title) return;
    document.title = `Movie| ${title}`;
    return function () {
      document.title = "My Movie App";
    };
  });
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
    };
    onAddWatch(newWatchedMovie);
    onCloseMovie();
  }
  return (
    <div className="details">
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {!isLoading && !error && (
        <header>
          <button className="btn-back" onClick={onCloseMovie}>
            {" "}
            &larr;
          </button>
          <img src={poster} alt={`poster of the ${movie}`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>
              {released}&bull;{runtime}
            </p>
            <p>{genre}</p>
            <p>
              {" "}
              <span>⭐</span>
              {imdbRating} IMDb rating
            </p>
          </div>
        </header>
      )}

      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  Add to list
                </button>
              )}
            </>
          ) : (
            <p>
              you rated this movie {watchedUserRating}
              <span>⭐</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
export default MovieDetails;

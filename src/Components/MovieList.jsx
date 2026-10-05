import Movie from "./Movie";

function MovieList({ movies, onAddMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onAddMovie={onAddMovie} />
      ))}
    </ul>
  );
}
export default MovieList;

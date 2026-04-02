import toast, { Toaster } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import "./App.css";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";

function App() {
  const [search, setSearch] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(movie);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", search, currentPage],
    queryFn: () => fetchMovies(search, currentPage),
    enabled: search !== "",
  });

  console.log(data);

  const closeModal = () => {
    setMovie(null);
  };

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  // const handleSearch = async (query: string) => {
  //   try {
  //     setMovies([]);
  //     setLoader(true);
  //     setError(false);
  //     const data = await fetchMovies(query);
  //     if (!data.results.length) {
  //       toast.error("No movies found for your request.");
  //       return;
  //     }
  //     setMovies(data.results);
  //   } catch {
  //     setError(true);
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <button onClick={() => setCurrentPage(currentPage + 1)}>
        Load More {currentPage}
      </button>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && <MovieGrid movies={data.results} onSelect={setMovie} />}
      <Toaster position="top-center" reverseOrder={false} />
      {movie && <MovieModal onClose={closeModal} movie={movie} />}
    </>
  );
}

export default App;

import toast, { Toaster } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import "./App.css";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ReactPaginateModule from "react-paginate";
import { type ReactPaginateProps } from "react-paginate";
import { type ComponentType } from "react";
import css from "./App.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [search, setSearch] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  console.log(movie);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", search, page],
    queryFn: () => fetchMovies(search, page),
    enabled: search !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  const closeModal = () => {
    setMovie(null);
  };

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  useEffect(() => {
    if (isSuccess && !data.results.length) {
      toast.error("No movies found for your request.");
    }
  }, [data, isSuccess]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {data && <MovieGrid movies={data.results} onSelect={setMovie} />}
      <Toaster position="top-center" reverseOrder={false} />
      {movie && <MovieModal onClose={closeModal} movie={movie} />}
    </>
  );
}

export default App;

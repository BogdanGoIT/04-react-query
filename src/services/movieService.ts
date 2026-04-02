import axios from "axios";
import type { Movie } from "../types/movie";

export interface GetMovieRes {
  results: Movie[];
  total_page: number;
}

const movieKey = import.meta.env.VITE_TMDB_TOKEN;

const url = `https://api.themoviedb.org/3/search/movie`;

export default async function fetchMovies(
  query: string,
  page: number = 1,
): Promise<GetMovieRes> {
  const res = await axios.get<GetMovieRes>(url, {
    params: {
      // твої параметри
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${movieKey}`,
    },
  });

  return res.data;
}

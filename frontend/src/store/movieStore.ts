import { create } from 'zustand'
import {
  movieService,
  type CreateMovieDto,
  type UpdateMovieDto,
} from '@/services/movieService'
import type { Movie } from '@/types/movie'

interface MovieStore {
  movies: Movie[]
  total: number
  currentPage: number
  totalPages: number
  isLoading: boolean
  error: string | null
  fetchMovies: (page?: number, limit?: number) => Promise<void>
  addMovie: (movie: CreateMovieDto, poster?: File) => Promise<void>
  updateMovie: (
    id: string,
    movie: UpdateMovieDto,
    poster?: File
  ) => Promise<void>
  deleteMovie: (id: string) => Promise<void>
  searchMovies: (query: string) => Promise<void>
}

export const useMovieStore = create<MovieStore>()(set => ({
  movies: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
  isLoading: false,
  error: null,

  fetchMovies: async (page: number = 1, limit: number = 8) => {
    set({ isLoading: true, error: null })
    try {
      const response = await movieService.getAll(page, limit)
      set({
        movies: response.data,
        total: response.total,
        currentPage: response.page,
        totalPages: response.totalPages,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch movies',
        isLoading: false,
      })
    }
  },

  addMovie: async (movie: CreateMovieDto, poster?: File) => {
    set({ isLoading: true, error: null })
    try {
      const newMovie = await movieService.create(movie, poster)
      set(state => ({
        movies: [...state.movies, newMovie],
        isLoading: false,
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add movie',
        isLoading: false,
      })
      throw error
    }
  },

  updateMovie: async (id: string, movie: UpdateMovieDto, poster?: File) => {
    set({ isLoading: true, error: null })
    try {
      const updatedMovie = await movieService.update(id, movie, poster)
      set(state => ({
        movies: state.movies?.map(m => (m.id === id ? updatedMovie : m)),
        isLoading: false,
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update movie',
        isLoading: false,
      })
      throw error
    }
  },

  deleteMovie: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await movieService.delete(id)
      set(state => ({
        movies: state.movies.filter(m => m.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete movie',
        isLoading: false,
      })
      throw error
    }
  },

  searchMovies: async (query: string) => {
    set({ isLoading: true, error: null })
    try {
      const movies = await movieService.search(query)
      set({ movies, isLoading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to search movies',
        isLoading: false,
      })
    }
  },
}))

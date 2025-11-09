import { api } from './api'
import type { Movie } from '@/types/movie'

export interface CreateMovieDto {
  title: string
  releaseYear: number
  posterUrl?: string
}

export interface UpdateMovieDto extends Partial<CreateMovieDto> {}

export interface PaginatedResponse {
  data: Movie[]
  total: number
  page: number
  totalPages: number
}

export const movieService = {
  getAll: async (
    page: number = 1,
    limit: number = 8
  ): Promise<PaginatedResponse> => {
    const { data } = await api.get<PaginatedResponse>(
      `/movies?page=${page}&limit=${limit}`
    )
    return data
  },

  getOne: async (id: string): Promise<Movie> => {
    const { data } = await api.get<Movie>(`/movies/${id}`)
    return data
  },

  create: async (movie: CreateMovieDto, poster?: File): Promise<Movie> => {
    const formData = new FormData()

    // Append movie data as individual fields
    formData.append('title', movie.title)
    formData.append('releaseYear', movie.releaseYear.toString())
    if (poster) formData.append('poster', poster)

    const { data } = await api.post<Movie>('/movies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  update: async (
    id: string,
    movie: UpdateMovieDto,
    poster?: File
  ): Promise<Movie> => {
    const formData = new FormData()

    // Append movie data as individual fields
    if (movie.title) formData.append('title', movie.title)
    if (movie.releaseYear)
      formData.append('releaseYear', movie.releaseYear.toString())
    if (poster) formData.append('poster', poster)

    const { data } = await api.patch<Movie>(`/movies/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/movies/${id}`)
  },

  search: async (query: string): Promise<Movie[]> => {
    const { data } = await api.get<Movie[]>('/movies/search', {
      params: { q: query },
    })
    return data
  },
}

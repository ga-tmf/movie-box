import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MovieList } from '../MovieList'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

describe('MovieList', () => {
  it('renders empty state when no movies', () => {
    render(<MovieList movies={[]} />)
    expect(
      screen.getByText(/No movies yet. Add your first movie to get started!/i)
    ).toBeInTheDocument()
  })

  it('renders movie list when movies exist', () => {
    const movies = [
      {
        id: '1',
        title: 'Test Movie',
        year: 2024,
        genre: 'Action',
        director: 'Test Director',
        rating: 8.5,
      },
    ]
    
    render(<MovieList movies={movies} />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Year: 2024')).toBeInTheDocument()
    expect(screen.getByText('Genre: Action')).toBeInTheDocument()
  })
})

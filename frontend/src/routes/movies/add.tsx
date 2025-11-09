import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Container, Card, CardContent, Typography } from '@mui/material'
import { MovieForm } from '@/components/MovieForm'
import { useMovieStore } from '@/store/movieStore'
import { useAuthStore } from '@/store/authStore'
import type { Movie } from '@/types/movie'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/movies/add')({
  component: AddMoviePage,
})

function AddMoviePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { addMovie } = useMovieStore()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  const handleSubmit = async (movie: Omit<Movie, 'id'>, file?: File) => {
    try {
      setSubmitError(null)
      // Map the form data to the backend expected format
      const movieData = {
        title: movie.title,
        releaseYear: movie.releaseYear,
      }
      await addMovie(movieData, file)
      navigate({ to: '/' })
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to add movie')
    }
  }

  const handleCancel = () => {
    navigate({ to: '/' })
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: 'Montserrat',
              fontWeight: 700,
              fontSize: { xs: '32px', md: '48px' },
              lineHeight: { xs: '40px', md: '56px' },
              color: '#FFFFFF',
              mb: 5,
            }}
          >
            Create a new movie
          </Typography>
          {submitError && (
            <Typography
              sx={{
                fontFamily: 'Montserrat',
                fontSize: '14px',
                color: '#FF6B6B',
                mb: 2,
              }}
            >
              {submitError}
            </Typography>
          )}
          <MovieForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </Container>
  )
}

import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Container, Card, CardContent, Typography, Button } from '@mui/material'
import { MovieForm } from '@/components/MovieForm'
import { useMovieStore } from '@/store/movieStore'
import { useAuthStore } from '@/store/authStore'
import type { Movie } from '@/types/movie'
import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export const Route = createFileRoute('/movies/$movieId_/edit')({
  component: EditMoviePage,
})

function EditMoviePage() {
  const { movieId } = Route.useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { movies, updateMovie, fetchMovies } = useMovieStore()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  // Fetch movies if not already loaded
  useEffect(() => {
    if (isAuthenticated && movies?.length === 0) {
      fetchMovies()
    }
  }, [isAuthenticated, movies?.length, fetchMovies])

  if (!isAuthenticated) {
    return null
  }

  const movie = movies.find(m => m.id === movieId)

  console.log('Edit page - movieId:', movieId)
  console.log('Edit page - movies:', movies)
  console.log('Edit page - found movie:', movie)

  if (!movie) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 8 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontSize: '48px',
                lineHeight: '56px',
                color: '#FFFFFF',
                mb: 4,
              }}
            >
              Movie Not Found
            </Typography>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
    )
  }

  const handleSubmit = async (data: Omit<Movie, 'id'>, file?: File) => {
    try {
      setSubmitError(null)
      // Map the form data to the backend expected format
      const movieData = {
        title: data.title,
        releaseYear: data.releaseYear,
      }
      await updateMovie(movieId, movieData, file)
      // Refetch movies to get the updated data
      await fetchMovies()
      navigate({ to: '/movies/$movieId', params: { movieId } })
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to update movie')
    }
  }

  const handleCancel = () => {
    navigate({ to: '/movies/$movieId', params: { movieId } })
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
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
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
            Edit Movie
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
          <MovieForm
            initialData={movie}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </Container>
  )
}

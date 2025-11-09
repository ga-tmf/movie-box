import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material'
import { useMovieStore } from '@/store/movieStore'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const Route = createFileRoute('/movies/$movieId')({
  component: MovieDetailPage,
})

function MovieDetailPage() {
  const { movieId } = Route.useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { movies, deleteMovie, fetchMovies } = useMovieStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  // Fetch movies if not already loaded
  useEffect(() => {
    if (isAuthenticated && movies.length === 0) {
      fetchMovies()
    }
  }, [isAuthenticated, movies.length, fetchMovies])

  if (!isAuthenticated) {
    return null
  }

  const movie = movies.find(m => m.id === movieId)

  if (!movie) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Card
          sx={{
            backgroundColor: '#092C39',
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
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Montserrat',
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 4,
              }}
            >
              The movie you're looking for doesn't exist or has been removed.
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

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${movie.title}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteMovie(movieId)
        navigate({ to: '/' })
      } catch (error) {
        alert('Failed to delete movie. Please try again.')
      }
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 4 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#FFFFFF',
              fontFamily: 'Montserrat',
              fontWeight: 500,
              fontSize: '16px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(43, 209, 126, 0.08)',
              },
            }}
          >
            Back to Movies
          </Button>
        </Link>
      </Box>

      {/* Main Content Card */}
      <Card
        variant="outlined"
        sx={{
          backgroundColor: '#092C39',
          border: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 6 },
            p: { xs: 3, md: 5 },
          }}
        >
          {/* Movie Poster Section */}
          <Box
            sx={{
              flex: { xs: '1', md: '0 0 400px' },
              maxWidth: { xs: '100%', md: '400px' },
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: { xs: '500px', md: '600px' },
                borderRadius: '12px',
                backgroundColor: movie.posterUrl ? 'transparent' : '#224957',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              {movie.posterUrl ? (
                <Box
                  component="img"
                  src={`${API_URL}${movie.posterUrl}`}
                  alt={movie.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#FFFFFF',
                      opacity: 0.3,
                      fontWeight: 600,
                      fontSize: '64px',
                      mb: 2,
                    }}
                  >
                    🎬
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FFFFFF',
                      opacity: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    No Poster Available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Movie Details Section */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {/* Title and Year */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: { xs: '36px', md: '56px' },
                    lineHeight: { xs: '44px', md: '64px' },
                    color: '#FFFFFF',
                    mb: 2,
                  }}
                >
                  {movie.title}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(43, 209, 126, 0.15)',
                    border: '1px solid rgba(43, 209, 126, 0.3)',
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'Montserrat',
                      fontWeight: 600,
                      fontSize: '24px',
                      color: '#2BD17E',
                    }}
                  >
                    {movie.releaseYear}
                  </Typography>
                </Box>
              </Box>

              {/* Additional Info Section (for future expansion) */}
              <Box
                sx={{
                  backgroundColor: 'rgba(34, 73, 87, 0.5)',
                  borderRadius: '12px',
                  p: 3,
                  mb: 4,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Montserrat',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontStyle: 'italic',
                  }}
                >
                  Movie added to your collection
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                mt: 'auto',
              }}
            >
              <Link
                to="/movies/$movieId/edit"
                params={{ movieId }}
                style={{ textDecoration: 'none', flex: 1 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  fullWidth
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontFamily: 'Montserrat',
                  }}
                >
                  Edit Movie
                </Button>
              </Link>
              <Button
                onClick={handleDelete}
                variant="outlined"
                startIcon={<DeleteOutlineIcon />}
                sx={{
                  flex: 1,
                  color: '#EB5757',
                  borderColor: '#EB5757',
                  px: 4,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: 'Montserrat',
                  '&:hover': {
                    borderColor: '#EB5757',
                    backgroundColor: 'rgba(235, 87, 87, 0.08)',
                  },
                }}
              >
                Delete Movie
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Container>
  )
}

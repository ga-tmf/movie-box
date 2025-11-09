import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Container, Typography, Box, Button } from '@mui/material'
import { useMovieStore } from '@/store/movieStore'
import { useAuthStore } from '@/store/authStore'
import { MovieList } from '@/components/MovieList'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuthStore()
  const { movies, totalPages, currentPage, isLoading, error, fetchMovies } =
    useMovieStore()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  // Fetch movies on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchMovies(1)
    }
  }, [isAuthenticated, fetchMovies])

  const handlePageChange = (page: number) => {
    fetchMovies(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Montserrat',
              fontSize: '24px',
              color: '#FFFFFF',
            }}
          >
            Loading movies...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Montserrat',
              fontSize: '24px',
              color: '#FF6B6B',
              textAlign: 'center',
            }}
          >
            Error: {error}
          </Typography>
          <Button
            onClick={() => fetchMovies()}
            variant="contained"
            color="primary"
          >
            Retry
          </Button>
        </Box>
      </Container>
    )
  }

  if (movies.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)',
            gap: 4,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Montserrat',
              fontWeight: 600,
              fontSize: '48px',
              lineHeight: '56px',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            Your movie list is empty
          </Typography>
          <Button
            component={Link}
            to="/movies/add"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Add a new movie
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box component="header" sx={{ mb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontSize: { xs: '32px', sm: '40px', md: '48px' },
                lineHeight: { xs: '40px', sm: '48px', md: '56px' },
              }}
            >
              My movies
            </Typography>
            <Link
              to="/movies/add"
              style={{
                marginTop: '-8px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src="/plus-icon.png"
                alt="Add Movie"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </Box>
          <Box
            onClick={handleLogout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontSize: '16px',
                color: '#FFFFFF',
              }}
            >
              Logout
            </Typography>
            <img
              src="/logout-icon.png"
              alt="Logout"
              style={{ width: '24px', height: '24px' }}
            />
          </Box>
        </Box>
      </Box>

      <Box component="main">
        <MovieList
          movies={movies}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Container>
  )
}

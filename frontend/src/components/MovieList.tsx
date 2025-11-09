import { Link } from '@tanstack/react-router'
import { Card, CardContent, Typography, Box, Button } from '@mui/material'
import type { Movie } from '@/types/movie'
import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://144.91.96.60:4000'

interface MovieListProps {
  movies: Movie[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function MovieList({
  movies,
  currentPage,
  totalPages,
  onPageChange,
}: MovieListProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (movieId: string) => {
    setImageErrors(prev => ({ ...prev, [movieId]: true }))
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3, // 24px gutter (3 * 8)
        }}
      >
        {movies?.map(movie => (
          <Link
            key={movie.id}
            to="/movies/$movieId"
            params={{ movieId: movie.id }}
            style={{ textDecoration: 'none' }}
          >
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                border: 'none',
                transition: 'transform 0.4s, box-shadow 0.8s',
                cursor: 'pointer',
                padding: '8px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(43, 209, 126, 0.18)',
                },
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  borderRadius: '12px',
                  backgroundColor:
                    movie.posterUrl && !imageErrors[movie.id]
                      ? 'transparent'
                      : '#224957',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {movie.posterUrl && !imageErrors[movie.id] ? (
                  <Box
                    component="img"
                    src={`${API_URL}${movie.posterUrl}`}
                    alt={movie.title}
                    onError={() => handleImageError(movie.id)}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : imageErrors[movie.id] ? (
                  <BrokenImageIcon
                    sx={{
                      fontSize: 80,
                      color: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                ) : (
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FFFFFF',
                      opacity: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    No Image
                  </Typography>
                )}
              </Box>
              <CardContent>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    fontSize: '20px',
                    lineHeight: '32px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {movie.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontFamily: 'Montserrat',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '24px',
                    letterSpacing: '0%',
                  }}
                >
                  {movie.releaseYear}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mt: 6,
            mb: 4,
          }}
        >
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{
              fontFamily: 'Montserrat',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(43, 209, 126, 0.1)',
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Prev
          </Button>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(page => (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                sx={{
                  fontFamily: 'Montserrat',
                  minWidth: '20px',
                  height: '40px',
                  color: '#FFFFFF',
                  backgroundColor:
                    currentPage === page ? '#2BD17E' : 'transparent',
                  fontSize: '16px',
                  fontWeight: currentPage === page ? 600 : 400,
                  '&:hover': {
                    backgroundColor:
                      currentPage === page
                        ? '#24A86A'
                        : 'rgba(43, 209, 126, 0.1)',
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            sx={{
              fontFamily: 'Montserrat',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(43, 209, 126, 0.1)',
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Next
          </Button>
        </Box>
      )}
    </>
  )
}

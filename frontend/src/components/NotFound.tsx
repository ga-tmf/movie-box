import { Link } from '@tanstack/react-router'
import { Container, Typography, Box, Button } from '@mui/material'

export function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Box
          sx={{
            fontSize: 120,
            opacity: 0.8,
            fontWeight: 300,
          }}
        >
          ⚠️
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: '500px',
            mb: 2,
          }}
        >
          Sorry, the page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            sx={{
              textTransform: 'none',
              px: 4,
            }}
          >
            Go to Home
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outlined"
            size="large"
            sx={{
              textTransform: 'none',
              px: 4,
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

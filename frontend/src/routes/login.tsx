import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate({ to: '/' })
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 111px)', // Account for bottom vectors
        px: 2,
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: '64px',
          fontWeight: 600,
          mb: 4,
          textAlign: 'center',
        }}
      >
        Sign in
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '300px',
          gap: 2.5,
        }}
      >
        <TextField
          type="email"
          label="Email"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <TextField
          type="password"
          label="Password"
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && (
          <Typography
            sx={{
              fontFamily: 'Montserrat',
              fontSize: '14px',
              color: '#FF6B6B',
              textAlign: 'center',
            }}
          >
            {error}
          </Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              disableRipple
              sx={{
                color: 'input.main',
                '&.Mui-checked': {
                  color: 'primary.main',
                },
                '& .MuiSvgIcon-root': {
                  backgroundColor: '#224957',
                  borderRadius: '4px',
                  width: 18,
                  height: 18,
                },
              }}
            />
          }
          label="Remember me"
          sx={{
            mx: 'auto',
            width: 'fit-content',
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{
            py: 1.5,
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Box>
  )
}

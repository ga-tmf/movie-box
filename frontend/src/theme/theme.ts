import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    input: Palette['primary']
    card: Palette['primary']
  }
  interface PaletteOptions {
    input?: PaletteOptions['primary']
    card?: PaletteOptions['primary']
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2BD17E',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EB5757',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#093545',
      paper: '#092C39',
    },
    input: {
      main: '#224957',
      contrastText: '#FFFFFF',
    },
    card: {
      main: '#092C39',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  spacing: 8, // Base spacing unit is 8px
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440, // Max width
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1440px !important',
          paddingLeft: 120, // Left margin
          paddingRight: 120, // Right margin
          '@media (max-width: 1440px)': {
            paddingLeft: 64,
            paddingRight: 64,
          },
          '@media (max-width: 900px)': {
            paddingLeft: 32,
            paddingRight: 32,
          },
          '@media (max-width: 600px)': {
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px', // 12px = 1.5 * 8, 24px = 3 * 8
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#092C39',
          borderRadius: 12,
          padding: 36, // 3 * 12
          boxShadow: 'none',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 8,
          '&:last-child': {
            paddingBottom: 8,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#224957',
            borderRadius: 8,
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0%',
            '& input': {
              color: '#FFFFFF',
              fontFamily: 'Montserrat',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '24px',
              letterSpacing: '0%',
            },
            '& textarea': {
              color: '#FFFFFF',
              fontFamily: 'Montserrat',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '24px',
              letterSpacing: '0%',
            },
            '& fieldset': {
              borderColor: '#224957',
            },
            '&:hover fieldset': {
              borderColor: '#2BD17E',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2BD17E',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#FFFFFF',
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0%',
            '&.Mui-focused': {
              color: '#2BD17E',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#224957',
          borderRadius: 8,
          fontFamily: 'Montserrat',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '24px',
          letterSpacing: '0%',
          '& input': {
            color: '#FFFFFF',
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0%',
          },
          '& textarea': {
            color: '#FFFFFF',
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0%',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2BD17E',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2BD17E',
          },
        },
        input: {
          padding: '12px 16px', // 12px = 1.5 * 8, 16px = 2 * 8
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          fontFamily: 'Montserrat',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '24px',
          letterSpacing: '0%',
          '&.MuiInputLabel-outlined': {
            transform: 'translate(14px, 12px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
          '&.Mui-focused': {
            color: '#2BD17E',
          },
        },
        asterisk: {
          display: 'none', // Hide required asterisk
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
  },
})

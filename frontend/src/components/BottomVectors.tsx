import { Box } from '@mui/material'

export function BottomVectors() {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '111px',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {/* Vector 1 - Green wave */}
      <Box
        component="img"
        src="/Vector.svg"
        alt=""
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          objectFit: 'cover',
        }}
      />
      {/* Vector 2 - Gray wave */}
      <Box
        component="img"
        src="/Vector-1.svg"
        alt=""
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  )
}

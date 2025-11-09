import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField, Button, Box, Typography } from '@mui/material'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { useCallback, useState } from 'react'
import type { Movie } from '@/types/movie'

const API_URL = import.meta.env.VITE_API_URL || 'http://144.91.96.60:4000'

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  releaseYear: z
    .number()
    .min(1888, 'Year must be 1888 or later')
    .max(new Date().getFullYear() + 5, 'Year is too far in the future'),
  posterUrl: z.string().optional(),
})

type MovieFormData = z.infer<typeof movieSchema>

interface MovieFormProps {
  initialData?: Movie
  onSubmit: (data: Omit<Movie, 'id'>, file?: File) => void
  onCancel: () => void
}

export function MovieForm({ initialData, onSubmit, onCancel }: MovieFormProps) {
  const isEditMode = !!initialData
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.posterUrl ? `${API_URL}${initialData.posterUrl}` : ''
  )
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string>('')
  const [isValidatingImage, setIsValidatingImage] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          releaseYear: initialData.releaseYear || new Date().getFullYear(),
          posterUrl: initialData.posterUrl || '',
        }
      : {
          title: '',
          releaseYear: new Date().getFullYear(),
          posterUrl: '',
        },
  })

  const posterUrlValue = watch('posterUrl')

  const validateImageDimensions = useCallback(
    (file: File): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
          URL.revokeObjectURL(url)
          const { width, height } = img

          // Check minimum dimensions (at least 300x400)
          if (width < 300 || height < 400) {
            setImageError(
              `Image is too small (${width}x${height}px). Please use an image at least 300x400 pixels.`
            )
            reject(false)
            return
          }

          // Check maximum dimensions (not more than 2000x3000)
          if (width > 2000 || height > 3000) {
            setImageError(
              `Image is too large (${width}x${height}px). Please use an image no larger than 2000x3000 pixels.`
            )
            reject(false)
            return
          }

          setImageError('')
          resolve(true)
        }

        img.onerror = () => {
          URL.revokeObjectURL(url)
          setImageError('Failed to load image. Please try another file.')
          reject(false)
        }

        img.src = url
      })
    },
    []
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) {
        setIsValidatingImage(true)
        validateImageDimensions(file)
          .then(() => {
            setUploadedFile(file)
            const reader = new FileReader()
            reader.onload = event => {
              const url = event.target?.result as string
              setPreviewUrl(url)
              setIsValidatingImage(false)
            }
            reader.readAsDataURL(file)
          })
          .catch(() => {
            setIsValidatingImage(false)
            // Error message already set in validateImageDimensions
          })
      }
    },
    [validateImageDimensions]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.type.startsWith('image/')) {
        setIsValidatingImage(true)
        validateImageDimensions(file)
          .then(() => {
            setUploadedFile(file)
            const reader = new FileReader()
            reader.onload = event => {
              const url = event.target?.result as string
              setPreviewUrl(url)
              setIsValidatingImage(false)
            }
            reader.readAsDataURL(file)
          })
          .catch(() => {
            setIsValidatingImage(false)
            // Error message already set in validateImageDimensions
          })
      }
      // Reset input so the same file can be selected again
      e.target.value = ''
    },
    [validateImageDimensions]
  )

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(data => {
        // Validate that poster image is uploaded
        if (!uploadedFile && !initialData?.posterUrl) {
          setImageError('Poster image is required')
          return
        }
        onSubmit(data, uploadedFile || undefined)
      })}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        maxWidth: 900,
      }}
    >
      {/* Left side - Drag and drop area */}
      <Box
        sx={{
          width: { xs: '100%', md: 450 },
          flexShrink: 0,
        }}
      >
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            width: '100%',
            height: { xs: 400, md: 500 },
            border: `2px dashed ${dragActive ? '#2BD17E' : 'rgba(255, 255, 255, 0.8)'}`,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: dragActive ? 'rgba(43, 209, 126, 0.1)' : '#224957',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              borderColor: '#2BD17E',
              backgroundColor: 'rgba(43, 209, 126, 0.05)',
            },
          }}
          onClick={() => document.getElementById('poster-upload')?.click()}
        >
          {isValidatingImage ? (
            <Box
              sx={{
                textAlign: 'center',
                px: 3,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '4px solid #2BD17E',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  mb: 2,
                  mx: 'auto',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Montserrat',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 14,
                }}
              >
                Validating image...
              </Typography>
            </Box>
          ) : previewUrl || posterUrlValue ? (
            <>
              <Box
                component="img"
                src={previewUrl || posterUrlValue}
                alt="Preview"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {isEditMode && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: '#FFFFFF',
                    py: 2,
                    textAlign: 'center',
                    fontFamily: 'Montserrat',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Click to change poster
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                px: 3,
              }}
            >
              <SaveAltIcon
                sx={{
                  width: 20,
                  color: '#FFFFFF',
                  mb: 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Montserrat',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 14,
                }}
              >
                Drop an image here
              </Typography>
            </Box>
          )}
          <input
            id="poster-upload"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </Box>
        {imageError && (
          <Typography
            variant="caption"
            sx={{
              color: '#d32f2f',
              fontFamily: 'Montserrat',
              mt: 1,
              display: 'block',
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              padding: '8px 12px',
              borderRadius: '4px',
            }}
          >
            {imageError}
          </Typography>
        )}
        {errors.posterUrl && (
          <Typography
            variant="caption"
            sx={{
              color: '#d32f2f',
              fontFamily: 'Montserrat',
              mt: 1,
              display: 'block',
            }}
          >
            {errors.posterUrl.message}
          </Typography>
        )}
      </Box>

      {/* Right side - Form fields */}
      <Box
        sx={{
          paddingLeft: { xs: 0, md: '100px' },
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{
                maxWidth: '375px',
                '& .MuiInputBase-root': {
                  fontFamily: 'Montserrat',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Montserrat',
                },
              }}
            />
          )}
        />

        <Controller
          name="releaseYear"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Publishing year"
              type="number"
              fullWidth
              error={!!errors.releaseYear}
              helperText={errors.releaseYear?.message}
              onChange={e => field.onChange(parseInt(e.target.value))}
              sx={{
                maxWidth: '275px',
                '& .MuiInputBase-root': {
                  fontFamily: 'Montserrat',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Montserrat',
                },
              }}
            />
          )}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              fontFamily: 'Montserrat',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || isValidatingImage}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              fontFamily: 'Montserrat',
            }}
          >
            {isSubmitting
              ? 'Saving...'
              : isValidatingImage
                ? 'Validating...'
                : isEditMode
                  ? 'Update'
                  : 'Submit'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

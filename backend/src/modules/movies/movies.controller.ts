import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `poster-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  create(
    @Body() createMovieDto: any,
    @UploadedFile() file?: any,
  ) {
    // Validate that file is uploaded
    if (!file) {
      throw new Error('Poster image is required');
    }

    // Convert string numbers to actual numbers
    const movieData: CreateMovieDto = {
      title: createMovieDto.title,
      releaseYear: parseInt(createMovieDto.releaseYear),
    };
    
    movieData.posterUrl = `/uploads/posters/${file.filename}`;
    return this.moviesService.create(movieData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies with pagination' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 8;
    return this.moviesService.findAll(pageNum, limitNum);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search movies by title, director, or genre' })
  search(@Query('q') query: string) {
    return this.moviesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a movie' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `poster-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: any,
    @UploadedFile() file?: any,
  ) {
    // Convert string numbers to actual numbers
    const movieData: any = {};
    
    if (updateMovieDto.title) movieData.title = updateMovieDto.title;
    if (updateMovieDto.releaseYear) movieData.releaseYear = parseInt(updateMovieDto.releaseYear);
    
    if (file) {
      movieData.posterUrl = `/uploads/posters/${file.filename}`;
    }
    return this.moviesService.update(id, movieData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}

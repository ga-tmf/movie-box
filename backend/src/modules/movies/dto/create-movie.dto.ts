import { IsString, IsInt, Min, Max, IsUrl, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Shawshank Redemption' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({ example: 1994 })
  @IsInt()
  @Min(1800)
  @Max(2100)
  releaseYear: number;

  @ApiProperty({ example: '/uploads/posters/poster.jpg', required: false })
  @IsString()
  @IsOptional()
  posterUrl?: string;
}

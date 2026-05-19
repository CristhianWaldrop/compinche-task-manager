import { IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['pending', 'done'], { message: 'El estado debe ser pending o done' })
  status?: string;

  @IsDateString(
    {},
    { message: 'La fecha de vencimiento debe ser una fecha válida' },
  )
  @IsOptional()
  dueDate?: string;
}

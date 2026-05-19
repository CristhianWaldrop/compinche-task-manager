import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  title!: string;

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
  @IsNotEmpty({ message: 'La fecha de vencimiento es requerida' })
  dueDate!: string;
}

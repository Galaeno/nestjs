import {
  IsString,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateTask {
  @IsNumber() id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  title?: string;

  @IsBoolean()
  status?: boolean;
}

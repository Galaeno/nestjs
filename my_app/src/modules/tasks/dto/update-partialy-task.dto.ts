import {
  IsString,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdatePartialyTask {
  @IsNumber() id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

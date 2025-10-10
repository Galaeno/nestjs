import {
  IsString,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdatePartialyTask {
  @IsString() id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  title: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}

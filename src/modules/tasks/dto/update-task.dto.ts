import { IsString, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class UpdateTask {
  @IsString() id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @IsBoolean()
  status: boolean;
}

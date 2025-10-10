import { IsString, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateTask {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @IsBoolean()
  status: boolean;
}

import { IsString, IsBoolean } from 'class-validator';

export class Task {
  @IsString() id: string;
  @IsString() title: string;
  @IsBoolean() status: boolean;
}

import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class Task {
  @IsNumber() id: number;
  @IsString() title: string;
  @IsBoolean() status: boolean;
}

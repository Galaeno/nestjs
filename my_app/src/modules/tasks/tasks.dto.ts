import {
  IsString,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class Task {
  @IsNumber() id: number;
  @IsString() title: string;
  @IsBoolean() status: boolean;
}

export class CreateTask {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @IsBoolean()
  status: boolean;
}

export class UpdateTask {
  @IsNumber() id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  title?: string;

  @IsBoolean()
  status?: boolean;
}

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

export class DeleteTask {
  @IsNumber() id: number;
}

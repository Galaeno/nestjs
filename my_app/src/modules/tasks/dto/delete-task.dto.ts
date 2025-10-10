import { IsNumber } from 'class-validator';

export class DeleteTask {
  @IsNumber() id: number;
}

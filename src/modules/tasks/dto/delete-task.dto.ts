import { IsString } from 'class-validator';

export class DeleteTask {
  @IsString() id: string;
}

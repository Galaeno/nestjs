import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ValidateTaskIdPipe implements PipeTransform {
  transform(id: any) {
    if (isNaN(id)) {
      throw new HttpException(
        `El id [${id}] no tiene un formato valido, debe ser un numero`,
        HttpStatus.NOT_FOUND,
      );
    }

    return parseInt(id);
  }
}

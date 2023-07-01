import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(file: FileUpload, metadata: ArgumentMetadata) {
    const validExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.filename.split('.').slice(-1)[0];

    if (!validExtensions.includes(fileExtension)) {
      throw new BadRequestException('Image format must be jpg, jpeg or png');
    }

    return file;
  }
}

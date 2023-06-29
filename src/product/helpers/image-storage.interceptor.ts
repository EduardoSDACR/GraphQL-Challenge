import { createWriteStream } from 'fs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ImageStorageInterceptor implements NestInterceptor {
  constructor(private field: string) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<void>> {
    const ctx = GqlExecutionContext.create(context);
    const { file } = ctx.getContext().req.body.variables[this.field];
    const { filename, createReadStream } = file;

    const validExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = filename.split('.').slice(-1)[0];

    if (validExtensions.includes(fileExtension)) {
      const fileNewName = `${uuid()}.${fileExtension}`;
      const path = `./images/${fileNewName}`;

      await createReadStream().pipe(createWriteStream(path));

      file.filename = fileNewName;
    }

    return next.handle().pipe(tap(() => null));
  }
}

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryDto {
  @Expose()
  readonly id;

  @Expose()
  readonly name;

  @Expose()
  readonly description;
}

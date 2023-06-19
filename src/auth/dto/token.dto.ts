import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TokenDto {
  @Expose()
  readonly accessToken: string;

  @Expose()
  readonly exp: string;

  constructor(partial: Partial<TokenDto>) {
    Object.assign(this, partial);
  }
}

import { Expose } from 'class-transformer';

export class LoggedUserRDO {
  @Expose()
  public token: string;

  @Expose()
  public email: string;
}

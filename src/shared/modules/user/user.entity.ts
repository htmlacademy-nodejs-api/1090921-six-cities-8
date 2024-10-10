import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';

import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { OfferEntity } from '../offer/offer.entity.js';

const DEFAULT_AVATAR = 'avatar.jpg';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true })
  public name: string;

  @prop({ required: false })
  public avatar: string;

  @prop({ required: true })
  public password: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true })
  public type: UserType;

  @prop({
    ref: () => OfferEntity,
    default: [],
  })
  public favorites!: Ref<OfferEntity>[];

  constructor(userData: User, salt: string) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar || DEFAULT_AVATAR;
    this.name = userData.name;
    this.type = userData.type;
    this.setPassword(userData.password, salt);
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);

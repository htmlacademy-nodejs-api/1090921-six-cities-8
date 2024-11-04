import {
  defaultClasses,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose';

import { City, RentType, Amenity, Coordinates } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({
    type: () => String,
    enum: City,
    required: true
  })
  public city!: City;

  @prop({required: true})
  public imagePreview!: string;

  @prop({ type: () => [String], required: true })
  public images!: string[];

  @prop({
    type: () => String,
    enum: RentType,
    required: true
  })
  public rentType!: RentType;

  @prop({required: true})
  public roomsCount!: number;

  @prop({required: true})
  public guestsCount!: number;

  @prop({required: true})
  public price!: number;

  @prop({ type: () => [String], required: true })
  public amenities!: Amenity[];

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;

  @prop({ _id: false, required: true })
  public coordinates!: Coordinates;

  @prop()
  public commentsCount!: number;

  @prop({ default: false })
  public isPremium: boolean;
}

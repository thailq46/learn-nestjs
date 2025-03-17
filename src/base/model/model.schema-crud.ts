import {Prop, Schema} from '@nestjs/mongoose';
import mongoose from 'mongoose';

export interface UserInfo {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
}

@Schema()
export class BaseSchemaCRUD {
  @Prop({type: Object})
  createdBy: UserInfo;

  @Prop({type: Object})
  updatedBy: UserInfo;

  @Prop({type: Object})
  deletedBy: UserInfo;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({default: false})
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

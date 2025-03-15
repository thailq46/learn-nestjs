import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop() // để biết nó là thuộc tính của model
  name: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  phone: string;

  @Prop()
  age: number;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  DeletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

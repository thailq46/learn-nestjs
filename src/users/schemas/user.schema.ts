import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import {BaseSchemaCRUD} from 'src/base/model/model.schema-crud';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User extends BaseSchemaCRUD {
  @Prop() // để biết nó là thuộc tính của model
  name: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  age: number;

  @Prop()
  address: string;

  @Prop()
  gender: string;

  @Prop({type: Object})
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop()
  role: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

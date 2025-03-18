import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import {BaseSchemaCRUD} from 'src/base/models/model.schema-crud';
import {Role} from 'src/roles/schemas/role.schema';

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

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Role.name})
  role: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

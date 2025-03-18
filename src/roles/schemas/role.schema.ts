import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import {BaseSchemaCRUD} from 'src/base/models/model.schema-crud';
import {Permission} from 'src/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

// 1 User => Có 1 role và 1 role => có n permissions => 1 user => có n permissions
@Schema({timestamps: true})
export class Role extends BaseSchemaCRUD {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: Permission.name}]})
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

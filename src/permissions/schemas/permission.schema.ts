import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {BaseSchemaCRUD} from 'src/base/models/model.schema-crud';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({timestamps: true})
export class Permission extends BaseSchemaCRUD {
  @Prop()
  name: string;

  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

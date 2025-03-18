import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {BaseSchemaCRUD} from 'src/base/models/model.schema-crud';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({timestamps: true})
export class Company extends BaseSchemaCRUD {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

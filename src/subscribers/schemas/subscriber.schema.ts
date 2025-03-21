import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {BaseSchemaCRUD} from 'src/base/models/model.schema-crud';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema({timestamps: true})
export class Subscriber extends BaseSchemaCRUD {
  @Prop({required: true})
  name: string;

  @Prop()
  email: string;

  @Prop()
  skills: string[];
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);

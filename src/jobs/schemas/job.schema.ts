import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import {BaseSchemaCRUD} from 'src/base/model/model.schema-crud';

export type JobDocument = HydratedDocument<Job>;

@Schema({timestamps: true})
export class Job extends BaseSchemaCRUD {
  @Prop()
  name: string;

  @Prop()
  skill: string[];

  @Prop({type: Object})
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop()
  location: string;

  @Prop()
  salary: number;

  @Prop()
  quantity: number;

  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({default: false})
  isActive: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);

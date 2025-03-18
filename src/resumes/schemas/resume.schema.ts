import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import {BaseSchemaCRUD} from 'src/base/models/model.schema-crud';
import {Company} from 'src/companies/schemas/company.schema';
import {Job} from 'src/jobs/schemas/job.schema';

export type ResumeDocument = HydratedDocument<Resume>;

export enum EResumeStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({timestamps: true})
export class Resume extends BaseSchemaCRUD {
  @Prop({required: true})
  email: string;

  @Prop({required: true})
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  url: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Company.name})
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Job.name})
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop({default: EResumeStatus.PENDING})
  status: EResumeStatus;

  @Prop({type: mongoose.Schema.Types.Array})
  history: {
    status: EResumeStatus;
    updatedAt: Date;
    updatedBy: {
      _id: mongoose.Schema.Types.ObjectId;
      email: string;
    };
  }[];
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

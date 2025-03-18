import {IsMongoId, IsNotEmpty} from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({message: 'Url không được để trống'})
  url: string;

  @IsNotEmpty({message: 'CompanyId không được để trống'})
  @IsMongoId({message: 'CompanyId không hợp lệ'})
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({message: 'JobId không được để trống'})
  @IsMongoId({message: 'JobId không hợp lệ'})
  jobId: mongoose.Schema.Types.ObjectId;
}

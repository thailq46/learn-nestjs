import {PartialType} from '@nestjs/mapped-types';
import {Type} from 'class-transformer';
import {IsArray, IsEmail, IsNotEmpty, ValidateNested} from 'class-validator';
import {CreateResumeDto} from './create-resume.dto';

class UpdatedBy {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class History {
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  updatedAt: Date;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdatedBy)
  updatedBy: UpdatedBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @ValidateNested()
  @IsNotEmpty({message: 'History không được để trống'})
  @IsArray({message: 'History phải là mảng'})
  @Type(() => History)
  history: History[];
}

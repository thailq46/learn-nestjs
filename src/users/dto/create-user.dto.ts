import {Type} from 'class-transformer';
import {IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested} from 'class-validator';
import mongoose from 'mongoose';

// DTO là cửa ngõ trước khi vào Controller
export class CompanyDTO {
  @IsNotEmpty({
    message: 'Name không được để trống',
  })
  name: string;

  @IsNotEmpty({
    message: '_id không được để trống',
  })
  _id: mongoose.Schema.Types.ObjectId;
}

export class CreateUserDto {
  @IsEmail(undefined, {
    message: 'Email không đúng định dạng',
  })
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password không được để trống',
  })
  password: string;

  name: string;

  age?: number;

  gender?: string;

  address?: string;

  role?: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDTO)
  company?: CompanyDTO;
}

export class RegisterUserDto {
  @IsEmail(undefined, {
    message: 'Email không đúng định dạng',
  })
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password không được để trống',
  })
  password: string;

  @IsNotEmpty({
    message: 'Name không được để trống',
  })
  name: string;

  @IsNotEmpty({
    message: 'Age không được để trống',
  })
  age: number;

  gender: string;

  address: string;
}

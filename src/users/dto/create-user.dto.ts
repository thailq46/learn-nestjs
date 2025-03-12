import {IsEmail, IsNotEmpty} from 'class-validator';

export class CreateUserDto {
  @IsEmail(undefined, {
    message: 'Email không đúng định dạng',
  })
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  email: string;

  @IsNotEmpty()
  password: string;

  name: string;
}

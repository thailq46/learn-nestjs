import {Transform, Type} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import {IsDateBefore} from 'src/decorator/date.decorator';
import {CompanyDTO} from 'src/users/dto/create-user.dto';

export class CreateJobDto {
  @IsNotEmpty({message: 'Name không được để trống'})
  name: string;

  @IsNotEmpty({message: 'Skill không được để trống'})
  @IsArray({message: 'Skill phải là mảng'})
  @IsString({each: true, message: 'Skill phải là chuỗi'})
  skill: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDTO)
  company: CompanyDTO;

  @IsNotEmpty({message: 'Location không được để trống'})
  location: string;

  @IsNotEmpty({message: 'Salary không được để trống'})
  salary: number;

  @IsNotEmpty({message: 'Quantity không được để trống'})
  quantity: number;

  @IsNotEmpty({message: 'Level không được để trống'})
  level: string;

  @IsNotEmpty({message: 'Description không được để trống'})
  description: string;

  @IsNotEmpty({message: 'startDate không được để trống'})
  @Transform(({value}) => new Date(value))
  @IsDate({message: 'startDate có định dạng là Date'})
  @IsDateBefore('endDate', {message: 'Ngày bắt đầu phải trước ngày kết thúc'})
  startDate: Date;

  @IsNotEmpty({message: 'endDate không được để trống'})
  @Transform(({value}) => new Date(value))
  @IsDate({message: 'endDate có định dạng là Date'})
  // @ValidateIf((o) => o.startDate && o.startDate instanceof Date)
  // isEndDateValid(): boolean {
  //   const isValid = this.startDate < this.endDate;
  //   if (!isValid) {
  //     throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
  //   }
  //   return isValid;
  // }
  endDate: Date;

  @IsBoolean({message: 'isActive phải là boolean'})
  isActive?: boolean;
}

import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import mongoose from 'mongoose';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User, UserDocument} from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}

  hashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async create(body: CreateUserDto) {
    const hashPassword = this.hashPassword(body.password);
    const user = await this.userModel.create({...body, password: hashPassword});
    return user;
  }

  findAll() {
    return this.userModel.find().select('-password -__v').lean();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Id is invalid';
    }
    return this.userModel.findById(id).select('-password -__v').lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Id is invalid';
    }
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).select('-password -__v').lean();
    return user;
  }

  async remove(id: string) {
    await this.userModel.softDelete({_id: id});
    return 'Xóa user thành công';
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({email: username}).select('-__v').lean();
  }
}

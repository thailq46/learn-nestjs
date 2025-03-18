import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import aqp from 'api-query-params';
import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import mongoose from 'mongoose';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {Role, RoleDocument} from 'src/roles/schemas/role.schema';
import {IUser, USER_ROLE} from 'src/types/user.interface';
import {CreateUserDto, RegisterUserDto} from 'src/users/dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User, UserDocument} from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  hashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async create(body: CreateUserDto, user: IUser) {
    const isExist = await this.userModel.findOne({email: body.email});
    if (isExist) {
      throw new BadRequestException(`Email ${body.email} đã tồn tại`);
    }
    // Fetch role user
    const userRole = await this.roleModel.findOne({name: USER_ROLE});
    const hashPassword = this.hashPassword(body.password);
    const newUser = await this.userModel.create({
      ...body,
      password: hashPassword,
      createdBy: {_id: user._id, email: user.email},
      role: userRole?._id,
    });
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  async register(body: RegisterUserDto) {
    const {name, email, password, age, gender, address} = body;
    const hashPassword = this.hashPassword(password);
    const isExist = await this.userModel.findOne({email});
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại`);
    }
    // Fetch role user
    const userRole = await this.roleModel.findOne({name: USER_ROLE});
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?._id,
    });
    return user;
  }

  async findAll({page, limit, qs}: {page: number; limit: number; qs: any}) {
    const {filter, sort, population} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;

    const offset = (page - 1) * limit;
    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const users = await this.userModel
      .find(filter)
      .sort(sort as any)
      .limit(limit)
      .skip(offset)
      .populate(population)
      .select('-password -__v')
      .lean();

    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      data: users,
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Id is invalid';
    }
    return this.userModel.findById(id).select('-password -__v').lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Id is invalid';
    }
    const updateUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserDto,
          updatedBy: {_id: user._id, email: user.email},
        },
        {new: true},
      )
      .select('-password -__v')
      .populate({path: 'role', select: {name: 1, _id: 1}})
      .lean();
    return {
      _id: updateUser?._id,
      updatedAt: updateUser?.updatedAt,
    };
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Id không hợp lệ';
    }
    const foundUser = await this.userModel.findById(id);
    if (foundUser?.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể xóa tài khoản admin');
    }
    await this.userModel.updateOne({_id: id}, {deletedBy: {_id: user._id, email: user.email}});
    await this.userModel.softDelete({_id: id});
    return {
      _id: id,
    };
  }

  findOneByUsername(username: string) {
    return this.userModel
      .findOne({email: username})
      .select('-__v')
      .populate({path: 'role', select: {name: 1}})
      .lean();
  }

  async updateUserRefreshToken(userId: string, refreshToken: string) {
    return await this.userModel.updateOne({_id: userId}, {refreshToken});
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel
      .findOne({refreshToken})
      .select('-password -__v')
      .populate({path: 'role', select: {name: 1}})
      .lean();
  };
}

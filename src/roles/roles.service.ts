import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {Role, RoleDocument} from 'src/roles/schemas/role.schema';
import {ADMIN_ROLE, IUser} from 'src/types/user.interface';
import {CreateRoleDto} from './dto/create-role.dto';
import {UpdateRoleDto} from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const {name, description, isActive, permissions} = createRoleDto;
    const isExist = await this.roleModel.findOne({name});
    if (isExist) {
      throw new BadRequestException(`Role với tên: ${name} đã tồn tại`);
    }
    const newRole = await this.roleModel.create({
      name,
      description,
      isActive,
      permissions,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {_id: newRole._id, createdAt: newRole.createdAt};
  }

  async findAll({currentPage, pageSize, query}: {currentPage: number; pageSize: number; query: any}) {
    const unSelect = ['-deletedAt', '-deletedBy', '-isDeleted', '-__v', '-description'];
    const {filter, population, sort, projection} = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;

    const offset = (currentPage - 1) * pageSize;

    const totalItems = await this.roleModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);

    const permissions = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate(population)
      .select(projection || unSelect)
      .lean();

    return {
      meta: {
        current: currentPage,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      data: permissions,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    const unSelect = [
      '-createdAt',
      '-updatedAt',
      '-deletedAt',
      '-createdBy',
      '-updatedBy',
      '-deletedBy',
      '-isDeleted',
      '-__v',
    ];
    const role = (await this.roleModel.findOne({_id: id, isDeleted: false}).select(unSelect))?.populate({
      path: 'permissions',
      select: {_id: 1, apiPath: 1, method: 1, module: 1, name: 1},
    });
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    const {name, description, isActive, permissions} = updateRoleDto;
    // const isExist = await this.roleModel.findOne({name, _id: {$ne: id}});
    // if (isExist) {
    //   throw new BadRequestException(`Role với tên: ${name} đã tồn tại`);
    // }
    const updated = await this.roleModel.updateOne(
      {_id: id},
      {
        name,
        description,
        isActive,
        permissions,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    const foundRole = await this.roleModel.findById(id);
    if (foundRole?.name === ADMIN_ROLE) {
      throw new BadRequestException('Không thể xóa role admin');
    }
    await this.roleModel.updateOne({_id: id}, {deletedBy: {_id: user._id, email: user.email}});
    return this.roleModel.softDelete({_id: id});
  }

  async findRoleByName(name: string) {
    return this.roleModel.findOne({
      name,
      isDeleted: false,
    });
  }
}

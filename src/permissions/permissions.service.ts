import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {Permission, PermissionDocument} from 'src/permissions/schemas/permission.schema';
import {IUser} from 'src/types/user.interface';
import {CreatePermissionDto} from './dto/create-permission.dto';
import {UpdatePermissionDto} from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const {name, apiPath, method, module} = createPermissionDto;
    const isExist = await this.permissionModel.findOne({apiPath, method});
    if (isExist) {
      throw new BadRequestException(`Permission với apiPath: ${apiPath} và method: ${method} đã tồn tại`);
    }
    const newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {_id: newPermission._id, createdAt: newPermission.createdAt};
  }

  async findAll({currentPage, pageSize, query}: {currentPage: number; pageSize: number; query: any}) {
    const unSelect = ['-deletedAt', '-deletedBy', '-isDeleted', '-__v', '-description'];
    const {filter, population, sort, projection} = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;

    const offset = (currentPage - 1) * pageSize;

    const totalItems = await this.permissionModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);

    const permissions = await this.permissionModel
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

  findOne(id: string) {
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
    return this.permissionModel.findOne({_id: id, isDeleted: false}).select(unSelect).lean();
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    const {name, apiPath, method, module} = updatePermissionDto;
    const updated = await this.permissionModel.updateOne(
      {_id: id},
      {
        module,
        name,
        method,
        apiPath,
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
    await this.permissionModel.updateOne({_id: id}, {deletedBy: {_id: user._id, email: user.email}});
    return this.permissionModel.softDelete({_id: id});
  }
}

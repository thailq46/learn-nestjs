import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ResponseMessage} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {IUser} from 'src/types/user.interface';
import {CreatePermissionDto} from './dto/create-permission.dto';
import {UpdatePermissionDto} from './dto/update-permission.dto';
import {PermissionsService} from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('Tạo mới permission thành công')
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách permission thành công')
  findAll(@Query('current') currentPage: string, @Query('pageSize') pageSize: string, @Query() query) {
    return this.permissionsService.findAll({
      currentPage: +currentPage,
      pageSize: +pageSize,
      query,
    });
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin permission thành công')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật permission thành công')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa permission thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}

import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ResponseMessage} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {IUser} from 'src/types/user.interface';
import {CreateRoleDto} from './dto/create-role.dto';
import {UpdateRoleDto} from './dto/update-role.dto';
import {RolesService} from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Tạo mới role thành công')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách role thành công')
  findAll(@Query('current') currentPage: string, @Query('pageSize') pageSize: string, @Query() query) {
    return this.rolesService.findAll({
      currentPage: +currentPage,
      pageSize: +pageSize,
      query,
    });
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin role thành công')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật role thành công')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa role thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}

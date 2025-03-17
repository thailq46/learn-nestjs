import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {IUser} from 'src/types/user.interface';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body('email') email: string, @Body('password') password: string, @Body('name') name: string) {
  //   return this.usersService.create({email, password, name});
  // }

  @Public()
  @Post()
  @ResponseMessage('Tạo tài khoản thành công')
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    const {email, password, name} = createUserDto;
    return this.usersService.create({email, password, name}, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Lấy danh sách tài khoản thành công')
  findAll(@Query() query: {current?: string; pageSize?: string}) {
    const {current = 1, pageSize = 10} = query;
    return this.usersService.findAll({
      page: +current,
      limit: +pageSize,
      qs: query,
    });
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Lấy thông tin tài khoản thành công')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tài khoản thành công')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tài khoản thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}

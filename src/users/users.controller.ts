import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const {email, password, name} = createUserDto;
    return this.usersService.create({email, password, name});
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

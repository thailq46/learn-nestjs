import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ResponseMessage, SkipCheckPermission} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {IUser} from 'src/types/user.interface';
import {CreateSubscriberDto} from './dto/create-subscriber.dto';
import {UpdateSubscriberDto} from './dto/update-subscriber.dto';
import {SubscribersService} from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage('Tạo mới subscriber thành công')
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Post('skills')
  @SkipCheckPermission()
  @ResponseMessage('Lấy danh sách skill của subscriber thành công')
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách subscriber thành công')
  findAll(@Query('current') currentPage: string, @Query('pageSize') pageSize: string, @Query() query) {
    return this.subscribersService.findAll({
      currentPage: +currentPage,
      pageSize: +pageSize,
      query,
    });
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin subscriber thành công')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage('Cập nhật subscriber thành công')
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}

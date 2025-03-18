import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ResponseMessage} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {IUser} from 'src/types/user.interface';
import {CreateResumeDto} from './dto/create-resume.dto';
import {ResumesService} from './resumes.service';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Thêm mới hồ sơ cv thành công')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Post('by-user')
  @ResponseMessage('Lấy danh sách hồ sơ cv theo user thành công')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.getResumesByUser(user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách hồ sơ cv thành công')
  findAll(@Query('current') currentPage: string, @Query('pageSize') pageSize: string, @Query() query) {
    return this.resumesService.findAll({
      currentPage: +currentPage,
      pageSize: +pageSize,
      query: query,
    });
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin hồ sơ cv thành công')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật trạng thái hồ sơ cv thành công')
  update(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa hồ sơ cv thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}

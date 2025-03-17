import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {IUser} from 'src/types/user.interface';
import {CreateJobDto} from './dto/create-job.dto';
import {UpdateJobDto} from './dto/update-job.dto';
import {JobsService} from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Tạo công việc thành công')
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật công việc thành công')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return this.jobsService.update({id, updateJobDto, user});
  }

  @Delete(':id')
  @ResponseMessage('Xóa công việc thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Lấy danh sách công việc thành công')
  findAll(@Query() query: {current?: string; pageSize?: string}) {
    const {current = '1', pageSize = '10'} = query;
    return this.jobsService.findAll({currentPage: +current, limit: +pageSize, qs: query});
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Lấy thông tin công việc thành công')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
}

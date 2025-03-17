import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {IUser} from 'src/types/user.interface';
import {CompaniesService} from './companies.service';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return this.companiesService.update({id, updateCompanyDto, user});
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Get all companies successfully')
  findAll(@Query() query: {current?: string; pageSize?: string}) {
    const {current = '1', pageSize = '10'} = query;
    return this.companiesService.findAll({currentPage: +current, limit: +pageSize, qs: query});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }
}

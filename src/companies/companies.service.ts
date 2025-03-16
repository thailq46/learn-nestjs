import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import aqp from 'api-query-params';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {Company, CompanyDocument} from 'src/companies/schemas/company.schema';
import {IUser} from 'src/types/user.interface';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const {_id, email} = user;
    const company = await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {_id, name: email},
    });
    return company;
  }

  async update({id, updateCompanyDto, user}: {id: string; updateCompanyDto: UpdateCompanyDto; user: IUser}) {
    const {_id, email} = user;
    const unSelect = ['-deletedAt', '-deletedBy', '-isDeleted', '-__v'];
    const company = await this.companyModel
      .findOneAndUpdate(
        {_id: id},
        {
          ...updateCompanyDto,
          updatedBy: {_id, name: email},
        },
        {new: true},
      )
      .select(unSelect)
      .lean();
    return company;
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedBy: {
        _id: user._id,
        name: user.email,
      },
    });
    return `Xóa công ty thành công`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async findAll({currentPage = 1, limit = 10, qs}: {currentPage?: number; limit?: number; qs: any}) {
    const unSelect = ['-deletedAt', '-deletedBy', '-isDeleted', '-__v', '-description'];
    const {filter, population, sort} = aqp(qs);
    delete filter.page;
    delete filter.limit;
    filter.isDeleted = false;

    const offset = (currentPage - 1) * limit;

    const totalItems = await this.companyModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const companies = await this.companyModel
      .find(filter)
      .select(unSelect)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .populate(population)
      .lean();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      data: companies,
    };
  }
}

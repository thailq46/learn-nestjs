import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {Job, JobDocument} from 'src/jobs/schemas/job.schema';
import {IUser} from 'src/types/user.interface';
import {CreateJobDto} from './dto/create-job.dto';
import {UpdateJobDto} from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const job = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        name: user.name,
      },
    });
    return job;
  }

  async update({id, updateJobDto, user}: {id: string; updateJobDto: UpdateJobDto; user: IUser}) {
    const {_id, email} = user;
    const unSelect = ['-deletedAt', '-deletedBy', '-isDeleted', '-__v'];
    const job = await this.jobModel
      .findOneAndUpdate(
        {_id: id},
        {
          ...updateJobDto,
          updatedBy: {_id, name: email},
        },
        {new: true},
      )
      .select(unSelect)
      .lean();
    return job;
  }

  async remove(id: string, user: IUser) {
    await this.jobModel.softDelete({_id: id});
    await this.jobModel.findByIdAndUpdate(id, {
      deletedBy: {
        _id: user._id,
        name: user.email,
      },
    });
    return {_id: id};
  }

  async findAll({currentPage = 1, limit = 10, qs}: {currentPage?: number; limit?: number; qs: any}) {
    const unSelect = ['-deletedAt', '-deletedBy', '-isDeleted', '-__v', '-description'];
    const {filter, population, sort} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;

    const offset = (currentPage - 1) * limit;

    const totalItems = await this.jobModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const jobs = await this.jobModel
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
      data: jobs,
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Id is invalid';
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
    return this.jobModel.findById(id).select(unSelect).lean();
  }
}

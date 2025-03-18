import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {EResumeStatus, Resume, ResumeDocument} from 'src/resumes/schemas/resume.schema';
import {IUser} from 'src/types/user.interface';
import {CreateResumeDto} from './dto/create-resume.dto';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) {}

  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const {companyId, jobId, url} = createResumeDto;
    const {email, _id} = user;
    const newCV = await this.resumeModel.create({
      email,
      userId: _id,
      companyId,
      jobId,
      url,
      history: [
        {
          status: EResumeStatus.PENDING,
          updatedAt: new Date(),
          updatedBy: {_id, email},
        },
      ],
      createdBy: {_id, email},
    });

    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt,
    };
  }

  async findAll({currentPage = 1, pageSize = 10, query}: {currentPage: number; pageSize: number; query: any}) {
    const unSelect = ['-deletedAt', '-deletedBy', '-isDeleted', '-__v', '-description'];
    const {filter, population, sort, projection} = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;

    const offset = (currentPage - 1) * pageSize;

    const totalItems = await this.resumeModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);

    const resumes = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate(population)
      .select(projection || unSelect)
      .lean();

    return {
      meta: {
        current: currentPage,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      data: resumes,
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
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
    return this.resumeModel.findById(id).select(unSelect).lean();
  }

  async update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    const updated = await this.resumeModel.updateOne(
      {_id: id},
      {
        status,
        updatedBy: {_id: user._id, email: user.email},
        $push: {
          history: {
            status,
            updatedAt: new Date(),
            updatedBy: {_id: user._id, email: user.email},
          },
        },
      },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    await this.resumeModel.updateOne({_id: id}, {deletedBy: {_id: user._id, email: user.email}});
    return this.resumeModel.softDelete({_id: id});
  }

  async getResumesByUser(user: IUser) {
    const resumes = await this.resumeModel
      .find({userId: user._id})
      .sort('-createdAt')
      .populate([
        {
          path: 'companyId',
          select: {name: 1},
        },
        {
          path: 'jobId',
          select: {name: 1},
        },
      ]);
    return resumes;
  }
}

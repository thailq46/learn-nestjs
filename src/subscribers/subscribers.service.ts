import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {Subscriber, SubscriberDocument} from 'src/subscribers/schemas/subscriber.schema';
import {IUser} from 'src/types/user.interface';
import {CreateSubscriberDto} from './dto/create-subscriber.dto';
import {UpdateSubscriberDto} from './dto/update-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(@InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const {name, email, skills} = createSubscriberDto;
    const isExist = await this.subscriberModel.findOne({email});
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại`);
    }
    const newSubs = await this.subscriberModel.create({
      name,
      email,
      skills,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newSubs._id,
      createdAt: newSubs.createdAt,
    };
  }

  async findAll({currentPage = 1, pageSize = 10, query}: {currentPage: number; pageSize: number; query: any}) {
    const unSelect = ['-deletedAt', '-deletedBy', '-isDeleted', '-__v', '-description'];
    const {filter, population, sort, projection} = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;

    const offset = (currentPage - 1) * pageSize;

    const totalItems = await this.subscriberModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);

    const permissions = await this.subscriberModel
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
      data: permissions,
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
    return this.subscriberModel.findById(id).select(unSelect).lean();
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const updated = await this.subscriberModel
      .updateOne(
        {email: user.email},
        {
          ...updateSubscriberDto,
          updatedBy: {_id: user._id, email: user.email},
        },
        // Nếu tồn tài rồi thì cập nhật, không thì tạo mới
        {upsert: true},
      )
      .select('-__v')
      .lean();
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    await this.subscriberModel.updateOne({_id: id}, {deletedBy: {_id: user._id, email: user.email}});
    return this.subscriberModel.softDelete({_id: id});
  }

  async getSkills(user: IUser) {
    return await this.subscriberModel.findOne({email: user.email}).select('skills').lean();
  }
}

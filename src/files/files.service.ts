import {Injectable} from '@nestjs/common';
import {CreateFileDto} from './dto/create-file.dto';
import {UpdateFileDto} from './dto/update-file.dto';

@Injectable()
export class FilesService {
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}

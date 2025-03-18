import {Module} from '@nestjs/common';
import {MulterModule} from '@nestjs/platform-express';
import {MulterConfigService} from 'src/base/configs/multer.config';
import {FilesController} from './files.controller';
import {FilesService} from './files.service';

@Module({
  imports: [MulterModule.registerAsync({useClass: MulterConfigService})],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}

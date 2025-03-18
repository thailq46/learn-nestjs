import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Permission, PermissionSchema} from 'src/permissions/schemas/permission.schema';
import {PermissionsController} from './permissions.controller';
import {PermissionsService} from './permissions.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Permission.name, schema: PermissionSchema}])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}

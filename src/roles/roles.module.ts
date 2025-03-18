import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Role, RoleSchema} from 'src/roles/schemas/role.schema';
import {RolesController} from './roles.controller';
import {RolesService} from './roles.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Role.name, schema: RoleSchema}])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}

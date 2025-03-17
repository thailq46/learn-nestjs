import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Job, JobSchema} from 'src/jobs/schemas/job.schema';
import {JobsController} from './jobs.controller';
import {JobsService} from './jobs.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Job.name, schema: JobSchema}])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}

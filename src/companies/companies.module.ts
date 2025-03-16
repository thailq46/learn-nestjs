import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Company, CompanySchema} from 'src/companies/schemas/company.schema';
import {CompaniesController} from './companies.controller';
import {CompaniesService} from './companies.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Company.name, schema: CompanySchema}])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}

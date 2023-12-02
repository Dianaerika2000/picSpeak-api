import { Module } from '@nestjs/common';
import { StatusIndividualUserService } from './status-individual-user.service';
import { StatusIndividualUserController } from './status-individual-user.controller';
import { StatusIndividualUser } from './entities/status-individual-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualUser } from 'src/users/entities/individual-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusIndividualUser, IndividualUser])],
  controllers: [StatusIndividualUserController],
  providers: [StatusIndividualUserService],
})
export class StatusIndividualUserModule {}

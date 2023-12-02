import { Module } from '@nestjs/common';
import { StatusIndividualUserService } from './status-individual-user.service';
import { StatusIndividualUserController } from './status-individual-user.controller';

@Module({
  controllers: [StatusIndividualUserController],
  providers: [StatusIndividualUserService],
})
export class StatusIndividualUserModule {}

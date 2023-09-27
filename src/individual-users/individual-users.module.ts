import { Module } from '@nestjs/common';
import { IndividualUsersService } from './individual-users.service';
import { IndividualUsersController } from './individual-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualUser } from './entities/individual-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndividualUser])],
  controllers: [IndividualUsersController],
  providers: [IndividualUsersService],
  exports: [IndividualUsersService]
})
export class IndividualUsersModule {}

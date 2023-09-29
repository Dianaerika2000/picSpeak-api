import { Module } from '@nestjs/common';
import { IndividualUsersService } from './individual-users.service';
import { IndividualUsersController } from './individual-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualUser } from './entities/individual-user.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IndividualUser]),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [IndividualUsersController],
  providers: [IndividualUsersService],
  exports: [TypeOrmModule, IndividualUsersService]
})
export class IndividualUsersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IndividualUser } from './entities/individual-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, IndividualUser])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService]
})

export class UsersModule { }

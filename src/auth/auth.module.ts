import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { IndividualUsersService } from 'src/individual-users/individual-users.service';
import { UsersModule } from 'src/users/users.module';
import { IndividualUsersModule } from 'src/individual-users/individual-users.module';

@Module({
  imports: [UsersModule, IndividualUsersModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { NacionalityService } from './nacionality.service';
import { NacionalityController } from './nacionality.controller';
import { Nacionality } from './entities/nacionality.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Nacionality])],
  controllers: [NacionalityController],
  providers: [NacionalityService],
})
export class NacionalityModule {}

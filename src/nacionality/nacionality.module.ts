import { Module } from '@nestjs/common';
import { NacionalityService } from './nacionality.service';
import { NacionalityController } from './nacionality.controller';
import { Nacionality } from './entities/nacionality.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageNacionality } from '../configuration/entities/language_nacionality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nacionality, LanguageNacionality])],
  controllers: [NacionalityController],
  providers: [NacionalityService],
})
export class NacionalityModule {}

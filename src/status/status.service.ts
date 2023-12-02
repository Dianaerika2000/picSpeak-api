import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status) private statusRepository: Repository<Status>
  ) { }

  async createStatu(status: CreateStatusDto) {
    const statusFound = await this.statusRepository.findOne({
      where: {
        status_info: status.status_info
      }
    })

    if (statusFound) {
      return new HttpException('Status already exists', HttpStatus.CONFLICT);
    }
    const newStatus = this.statusRepository.create(status);
    return { message: 'succes', data: await this.statusRepository.save(newStatus) };
  }
  async createStatus(status: CreateStatusDto[]) {
    const createdStatus = [];


    for (const statu of status) {
      const statusFound = await this.statusRepository.findOne({
        where: {
          status_info: statu.status_info,
        },
      });

      if (!statusFound) {

        const newStatus = this.statusRepository.create({
          status_info: statu.status_info
        });

        await this.statusRepository.save(newStatus);
        createdStatus.push(newStatus);
      }
    }

    return { message: 'success', data: createdStatus };
  }

  async getStatus() {
    return { message: 'success', data: await this.statusRepository.find() };
  }

  async findOne(id: number) {
    const languageFound = await this.statusRepository.findOne({ where: { id } });
    if (!languageFound) {
      return new HttpException('Language not found', HttpStatus.NOT_FOUND)
    }
    return { message: 'succes', data: languageFound };
  }

  async updateStatus(id: number, status: UpdateStatusDto) {
    const statusFound = await this.statusRepository.findOne({ where: { id } });
    if (!statusFound) {
      return new HttpException('Status not found', HttpStatus.NOT_FOUND)
    }

    const updatedStatus = Object.assign(statusFound, status);//FORMA DOS
    return { message: 'succes', data: await this.statusRepository.save(updatedStatus) };
  }

  async deleteStatus(id: number) {
    const result = await this.statusRepository.delete({ id });
    if (result.affected === 0) {
      return new HttpException('Status not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'succes' }
  }
}

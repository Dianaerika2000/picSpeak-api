import { Injectable } from '@nestjs/common';
import { CreateStatusIndividualUserDto } from './dto/create-status-individual-user.dto';
import { UpdateStatusIndividualUserDto } from './dto/update-status-individual-user.dto';

@Injectable()
export class StatusIndividualUserService {
  create(createStatusIndividualUserDto: CreateStatusIndividualUserDto) {
    return 'This action adds a new statusIndividualUser';
  }

  findAll() {
    return `This action returns all statusIndividualUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statusIndividualUser`;
  }

  update(id: number, updateStatusIndividualUserDto: UpdateStatusIndividualUserDto) {
    return `This action updates a #${id} statusIndividualUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusIndividualUser`;
  }
}

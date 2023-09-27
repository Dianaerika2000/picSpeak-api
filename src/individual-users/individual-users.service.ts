import { Injectable } from '@nestjs/common';
import { CreateIndividualUserDto } from './dto/create-individual-user.dto';
import { UpdateIndividualUserDto } from './dto/update-individual-user.dto';
import { IndividualUser } from './entities/individual-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IndividualUsersService {
  constructor(
    @InjectRepository(IndividualUser)
    private readonly individualUserRepository: Repository<IndividualUser>,
  ){}

  create(createIndividualUserDto: CreateIndividualUserDto) {
    return this.individualUserRepository.save(createIndividualUserDto);
  }

  findOneByEmail(email: string) {
    return this.individualUserRepository.findOneBy({ email })
  }

  findAll() {
    return `This action returns all individualUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} individualUser`;
  }

  update(id: number, updateIndividualUserDto: UpdateIndividualUserDto) {
    return `This action updates a #${id} individualUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} individualUser`;
  }
}

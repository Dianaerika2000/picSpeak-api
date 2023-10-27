import { Injectable } from '@nestjs/common';
import { CreateIndividualUserDto } from './dto/create-individual-user.dto';
import { UpdateIndividualUserDto } from './dto/update-individual-user.dto';
import { IndividualUser } from './entities/individual-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class IndividualUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(IndividualUser)
    private readonly individualUserRepository: Repository<IndividualUser>,
  ){}

  async create(createIndividualUserDto: CreateIndividualUserDto) {
    const user = new User();
    //user.type = createIndividualUserDto.type;
    user.photoUrl = createIndividualUserDto.photo_url;
    const newUser = await this.userRepository.save(user);

    const individual = new IndividualUser();
    individual.name = createIndividualUserDto.name;
    individual.lastname = createIndividualUserDto.lastname;
    individual.birthDate = createIndividualUserDto.birthDate;
    //individual.gender = createIndividualUserDto.gender;
    //individual.nationality = createIndividualUserDto.nationality;
    individual.email = createIndividualUserDto.email;
    individual.password = createIndividualUserDto.password;
    individual.user = newUser;

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

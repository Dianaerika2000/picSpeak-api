import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IndividualUser } from './entities/individual-user.entity';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { InterestUser } from 'src/configuration/entities/interest_user.entity';
import { LanguageUser } from 'src/configuration/entities/language_user.entity';
import { Contact } from 'src/contact/entities/contact.entity';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(IndividualUser)
    private readonly individualRepository: Repository<IndividualUser>,
    @InjectRepository(InterestUser)
    private interestUserRepository: Repository<InterestUser>,
    @InjectRepository(LanguageUser)
    private languageUserRepository: Repository<LanguageUser>,
    @InjectRepository(Contact) private contactRepository: Repository<Contact>
  ) { }

  create(createUserDto: CreateUserDto) {
    let user;

    if (createUserDto.type == 'individual') {
      user = new IndividualUser();
      user.name = createUserDto.name;
      user.lastname = createUserDto.lastname;
      user.username = createUserDto.username;
      user.birthDate = createUserDto.birthDate;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
      user.activationToken = createUserDto.activationToken;
      user.photo_url = createUserDto.photo_url != null ? createUserDto.photo_url : null;
    } else if (createUserDto.type == 'group') {
      //TODO: Código para crear usuarios tipo grupo
    }

    return this.individualRepository.save(createUserDto);
  }

  findAll() {
    return this.individualRepository.find();
  }

  async findOne(id: number) {
    //revisar, local todo ok
    return await this.individualRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateProfileDto) {
    const user = await this.individualRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.lastname) {
      user.lastname = updateUserDto.lastname;
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.gender) {
      user.gender = updateUserDto.gender;
    }
    if (updateUserDto.nationality) {
      user.nationality = updateUserDto.nationality;
    }
    if (updateUserDto.photo_url) {
      user.photo_url = updateUserDto.photo_url;
    }

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const userToRemove = await this.userRepository.findOne({ where: { id } });

    if (!userToRemove) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userRepository.remove(userToRemove);
  }

  findOneByEmail(email: string) {
    return this.individualRepository.findOne({ where: { email } });
  }

  async findOneByToken(token: string) {
    return this.individualRepository.findOne({ where: { activationToken: token } });
  }

  async save(individualUser: IndividualUser) {
    return this.individualRepository.save(individualUser);
  }

  //sugerencia de amigos
  async suggestUsers(userId: number) {
    const userFound = await this.individualRepository.findOne({ where: { id: userId }, relations: ['contact'] });
    if (!userFound) {
      return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
    }

    const userLanguages = await this.languageUserRepository.find({ where: { individualuser: { id: userId }, status: true }, relations: ['language'] });
    const userInterests = await this.interestUserRepository.find({ where: { individualuser: { id: userId }, status: true }, relations: ['interest'] });


    const userInterestIds = userInterests.map((interestUser) => interestUser.interest.id);
    const userLanguageIds = userLanguages.map((languageUser) => languageUser.language.id);

    if (userInterestIds.length === 0 && userLanguageIds.length === 0) {
      return [];
    }

    let usersWithSimilarInterests = [];
    let usersWithSimilarLanguages = [];
    let contactUserIds = [];
    if (userFound.contact) {
      contactUserIds = userFound.contact.map((contact) => contact.contactId);
    }

    // Only run the query if userInterestIds is not empty
    if (userInterestIds.length > 0) {
      let query = this.interestUserRepository
        .createQueryBuilder('interestUser')
        .innerJoinAndSelect('interestUser.interest', 'interest')
        .innerJoinAndSelect('interestUser.individualuser', 'individualuser')
        .where('interest.id IN (:...interests)', {
          interests: userInterestIds,
        });

      if (contactUserIds.length > 0) {
        query = query.andWhere('individualuser.id NOT IN (:...contactUserIds)', {
          contactUserIds: contactUserIds,
        });
      }

      usersWithSimilarInterests = await query.getMany();
    }

    // Only run the query if userLanguageIds is not empty
    if (userLanguageIds.length > 0) {
      let query = this.languageUserRepository
        .createQueryBuilder('languageUser')
        .innerJoinAndSelect('languageUser.language', 'language')
        .innerJoinAndSelect('languageUser.individualuser', 'individualuser')
        .where('language.id IN (:...languages)', {
          languages: userLanguageIds,
        });

      if (contactUserIds.length > 0) {
        query = query.andWhere('individualuser.id NOT IN (:...contactUserIds)', {
          contactUserIds: contactUserIds,
        });
      }

      usersWithSimilarLanguages = await query.getMany();
    }


    const userCounts = new Map();

    for (const interestUser of usersWithSimilarInterests) {
      const uId = interestUser.individualuser.id;
      if (userId != uId) {
        userCounts.set(uId, (userCounts.get(uId) || 0) + 1);
      }
    }

    for (const languageUser of usersWithSimilarLanguages) {
      const uId = languageUser.individualuser.id;
      if (userId != uId) {
        userCounts.set(uId, (userCounts.get(uId) || 0) + 1);
      }
    }

    const sortedUserIds = Array.from(userCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([userId, count]) => userId);

    const suggestedUsers = await this.individualRepository.findByIds(sortedUserIds);

    return suggestedUsers;
  }
}

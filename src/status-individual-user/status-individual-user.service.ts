import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateStatusIndividualUserDto } from './dto/create-status-individual-user.dto';
import { UpdateStatusIndividualUserDto } from './dto/update-status-individual-user.dto';
import { StatusIndividualUser } from './entities/status-individual-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IndividualUser } from 'src/users/entities/individual-user.entity';

@Injectable()
export class StatusIndividualUserService {
  constructor(
    @InjectRepository(StatusIndividualUser) private statusIndividualUserRepository: Repository<StatusIndividualUser>,
    @InjectRepository(IndividualUser) private individualUserRepository: Repository<IndividualUser>
  ) { }

  async insertStatusIndividualUser(statusIU: CreateStatusIndividualUserDto) {
    const userFound = await this.individualUserRepository.findOne({
      where: { id: statusIU.user_id }
    });
    if (!userFound) {
      return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
    }

    const statusUserFound = await this.statusIndividualUserRepository.find({
      where: {
        individualuser: { id: statusIU.user_id }
      }
    });

    if (statusUserFound.length > 0) {
      await Promise.all(statusUserFound.map(e => {
        e.status = false;
        return this.statusIndividualUserRepository.save(e);
      }));

      let statusFound = await this.statusIndividualUserRepository.findOne({
        where: {
          status_info: statusIU.status_info,
          individualuser: { id: statusIU.user_id }
        }
      });

      if (!statusFound) {
        statusFound = this.statusIndividualUserRepository.create({
          status_info: statusIU.status_info,
          individualuser: { id: statusIU.user_id },
        });
      }
      statusFound.status = true;
      const statusSave = await this.statusIndividualUserRepository.save(statusFound);
      return { message: "Succes", data: statusSave };
    } else {

      const nuevoRegistro = this.statusIndividualUserRepository.create({
        status_info: statusIU.status_info,
        status: true,
        individualuser: { id: statusIU.user_id },
      });

      const nuevoStatus = await this.statusIndividualUserRepository.save(nuevoRegistro);
      return { message: "Succes", data: nuevoStatus };
    }
  }

  async getStatusUser(id: number) {
    const userFound = await this.individualUserRepository.findOne({
      where: { id }
    });
    if (!userFound) {
      return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
    }

    const statusUserFound = await this.statusIndividualUserRepository.find({
      where: {
        individualuser: { id }
      }
    });

    return { message: "Succes", data: statusUserFound };
  }


  // async selectStatusUser(id:number){
    
  //   const statusFound= await this.statusIndividualUserRepository.findOne({where:{id}});
  //   if (!statusFound){
  //     return new HttpException('Estado no encontrada', HttpStatus.NOT_FOUND);
  //   }
  //   const statusUserFound = await this.statusIndividualUserRepository.find({where: {status:true}});
  //   if (statusUserFound.length>0){
  //     await Promise.all(statusUserFound.map(e => {
  //       e.status = false;
  //       return this.statusIndividualUserRepository.save(e);
  //     }));
  //   }
   

  // }
  async updateStatusUser(id: number, statusUser: UpdateStatusIndividualUserDto) {
    const statusUserFound = await this.statusIndividualUserRepository.findOne({ where: { id } });
    if (!statusUserFound) {
      return new HttpException('Status Individual User not found', HttpStatus.NOT_FOUND)
    }

    const updatedStatus = Object.assign(statusUserFound, statusUser);//FORMA DOS
    return { message: 'succes', data: await this.statusIndividualUserRepository.save(updatedStatus) };
  }

  async deleteStatusUser(id: number) {
    const result = await this.statusIndividualUserRepository.delete({ id });
    if (result.affected === 0) {
      return new HttpException('Status Individual User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'succes' }
  }
}

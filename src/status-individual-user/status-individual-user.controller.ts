import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { StatusIndividualUserService } from './status-individual-user.service';
import { CreateStatusIndividualUserDto } from './dto/create-status-individual-user.dto';
import { UpdateStatusIndividualUserDto } from './dto/update-status-individual-user.dto';

@Controller('status-individual-user')
export class StatusIndividualUserController {
  constructor(private readonly statusIndividualUserService: StatusIndividualUserService) {}

  //El usuario inserta un estado a su perfil
  @Post()
  insertStatusIndividualUser(@Body() createStatusIndividualUserDto: CreateStatusIndividualUserDto) {
    return this.statusIndividualUserService.insertStatusIndividualUser(createStatusIndividualUserDto);
  }
  //Obtener todos los estados del usuario con :id
  @Get('user/:id')
  getStatusUser(@Param('id', ParseIntPipe) id: number) {
    return this.statusIndividualUserService.getStatusUser(id);
  }

  @Put(':id')
  updateStatusUser(@Param('id', ParseIntPipe) id:number, @Body() updateStatusIndividualUserDto: UpdateStatusIndividualUserDto) {
    return this.statusIndividualUserService.updateStatusUser(+id, updateStatusIndividualUserDto);
  }

  @Delete(':id')
  deleteStatusUser(@Param('id', ParseIntPipe) id: number) {
    return this.statusIndividualUserService.deleteStatusUser(id);
  }
}

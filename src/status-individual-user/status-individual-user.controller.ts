import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusIndividualUserService } from './status-individual-user.service';
import { CreateStatusIndividualUserDto } from './dto/create-status-individual-user.dto';
import { UpdateStatusIndividualUserDto } from './dto/update-status-individual-user.dto';

@Controller('status-individual-user')
export class StatusIndividualUserController {
  constructor(private readonly statusIndividualUserService: StatusIndividualUserService) {}

  @Post()
  create(@Body() createStatusIndividualUserDto: CreateStatusIndividualUserDto) {
    return this.statusIndividualUserService.create(createStatusIndividualUserDto);
  }

  @Get()
  findAll() {
    return this.statusIndividualUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusIndividualUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusIndividualUserDto: UpdateStatusIndividualUserDto) {
    return this.statusIndividualUserService.update(+id, updateStatusIndividualUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusIndividualUserService.remove(+id);
  }
}

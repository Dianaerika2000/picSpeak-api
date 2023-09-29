import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IndividualUsersService } from './individual-users.service';
import { CreateIndividualUserDto } from './dto/create-individual-user.dto';
import { UpdateIndividualUserDto } from './dto/update-individual-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Individual Users')
@Controller('individual-users')
export class IndividualUsersController {
  constructor(private readonly individualUsersService: IndividualUsersService) {}

  @Post()
  create(@Body() createIndividualUserDto: CreateIndividualUserDto) {
    return this.individualUsersService.create(createIndividualUserDto);
  }

  @Get()
  findAll() {
    return this.individualUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.individualUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIndividualUserDto: UpdateIndividualUserDto) {
    return this.individualUsersService.update(+id, updateIndividualUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.individualUsersService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiTags } from '@nestjs/swagger';
import { STATUS_CODES } from 'http';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  getStatus() {
    return this.statusService.getStatus();
  }

  @Post()
  createStatu(@Body() createStatusDto: CreateStatusDto) {//crear por el envío de un array de elementos status
    return this.statusService.createStatu(createStatusDto);
  }
  
  @Post("create")
  createStatus(@Body() createStatusDto: CreateStatusDto[]) {//crear por el envío de un array de elementos status
    return this.statusService.createStatus(createStatusDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusService.findOne(+id);
  }

  @Put(':id')
  updateLanguage(@Param('id', ParseIntPipe) id: number, @Body() Status: UpdateStatusDto) {
      return this.statusService.updateStatus(id, Status);
  }

  @Delete(':id')
  deleteStatus(@Param('id', ParseIntPipe) id: number) {
      return this.statusService.deleteStatus(id);
  }
}

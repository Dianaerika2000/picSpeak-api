import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiTags } from '@nestjs/swagger';
import { VerifyImageDto } from './dto/verify-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }

  @Post('verify-content')
  @UseInterceptors(FileInterceptor('image'))
  async verifyContent(@UploadedFile() image, @Res() res) {
    try {
      const result = await this.imagesService.getTag(image);
      return res.send({ result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  }
}

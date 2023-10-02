import { Body, Controller, Get, Post, Put, Param, ParseIntPipe } from '@nestjs/common';
import { CreateLanguageNacionalityDto } from './dto/create-language-nacionality.dto';
import { ConfigurationService } from './configuration.service';
import { CreateLanguageUserDto } from './dto/create-language-user.dto';
import { SelectNacionalityUserDto } from './dto/select-nacionality-user.dto';
import { UpdateLanguageNacionalityDto } from './dto/update-language-nacionality.dto';
import { SelectNacionalityMatternLanguageUserDto } from './dto/select-nacionality-mattern-language-user.dto';
import { CreateInappropriateContentUserDto } from './dto/create-inappropriate-content-user.dto';
import { CreateInterestUserDto } from './dto/create-interest-user.dto';

@Controller('configuration')
export class ConfigurationController {
    constructor(private configurationService: ConfigurationService) { }

    //*****************LANGUAGE NACIONALITY******************************
    //crear un lenguaje a una nacionalidad
    @Post('nacionality/:id/create-language-nacionality')//el id de la nacionalidad
    createLanguageNacionality(@Param('id', ParseIntPipe) id: number, @Body() newLanguageNacionality: CreateLanguageNacionalityDto) {
        return this.configurationService.createLanguageNacionality(id, newLanguageNacionality);
    }
    //actualizar un lenguaje a una nacionalidad
    @Put('nacionality/:id/update-language-nacionality')//el id de la nacionalidad
    updateLanguageNacionality(@Param('id', ParseIntPipe) id: number, @Body() updateLanguageNacionality: UpdateLanguageNacionalityDto) {
        return this.configurationService.updateLanguageNacionality(id, updateLanguageNacionality);
    }
    //obtiene los lenguajes de una nacionalidad
    @Get('nacionality/:id/language-nacionality/')//Obtiene todos los lenguajes de una nacionalidad
    getLanguageNacionality(@Param('id', ParseIntPipe) id: number) {
        return this.configurationService.getLanguagesNacionality(id);
    }
    //*****************LANGUAGE USER******************************
    //Obtiene  de un usuario todos los lenguajes que estan con status en true
    @Get('/language-user/:id')
    getLanguagesUser(@Param('id', ParseIntPipe) id: number) {
        return this.configurationService.getLanguagesUser(id);
    }
    //actualiza los lenguajes seleccionado por un usuario
    @Post('/language-user/:id') //para actualizar los lenguajes seleccionados
    updateSelectLanguageUser(@Param('id', ParseIntPipe) id: number, @Body() newLanguageUser: CreateLanguageUserDto[]) {
        return this.configurationService.updateSelectLanguageUser(id, newLanguageUser);
    }
    //crea la relación por defecto entre todos los lenguajes y un usuario 
    @Post('/language-user/default/:id')
    createSelectLanguageUser(@Param('id', ParseIntPipe) id: number) {
        return this.configurationService.createSelectLanguageUser(id);
    }
    //Seleccionar lengua materna según los lenguajes de su nacionalidad, siempre debe estar con el status en true mientras sea lengua materna
    @Post('language-user/mattern/:id')
    selectMatternLanguageUser(@Param('id', ParseIntPipe) id: number, @Body() newSelectMatternLanguage: SelectNacionalityMatternLanguageUserDto) {
        return this.configurationService.selectMatternLanguage(id, newSelectMatternLanguage);
    }

    //*****************USER NACIONALITY************************
    //Selección de una nacionalidad para el usuario
    @Post(':id/nacionality') //para actualizar los lenguages seleccionados
    selectNacionalityUser(@Param('id', ParseIntPipe) id: number, @Body() newSelectNacionalityUser: SelectNacionalityUserDto) {
        return this.configurationService.selectNacionalityUser(id, newSelectNacionalityUser);
    }
    //********************USER INAPPROPRIATE CONTENT **********************
    //Obtiene de un usuario todos los contenidos inapropiados que estan con status en true
    @Get('/inappropriate-content-user/:id')
    getInappropriateContentsUser(@Param('id', ParseIntPipe) id: number) {
        return this.configurationService.getInappropriateContentUser(id);
    }
    //actualiza los contenidos inapropiados seleccionados por un usuario
    @Post('/inappropriate-content-user/:id') //para actualizar los contenidos inapropiados seleccionados
    updateSelectInappropriateContentUser(@Param('id', ParseIntPipe) id: number, @Body() newInappropriateContentUser: CreateInappropriateContentUserDto[]) {
        return this.configurationService.updateSelectInappropriateContentUser(id, newInappropriateContentUser);
    }
    //crea la relación por defecto entre todos los contenidos inapropiados y un usuario 
    @Post('/inappropriate-content-user/default/:id')
    createSelectInappropriateContentUser(@Param('id', ParseIntPipe) id: number) {
        return this.configurationService.createSelectInappropriateContentUser(id);
    }
    //********************USER INTEREST **********************
     //Obtiene de un usuario todos los intereses que estan con status en true
     @Get('/interest-user/:id')
     getInterestsUser(@Param('id', ParseIntPipe) id: number) {
         return this.configurationService.getInterestsUser(id);
     }
     //actualiza los intereses seleccionados por un usuario
     @Post('/interest-user/:id') //para actualizar los contenidos inapropiados seleccionados
     updateSelectInterestUser(@Param('id', ParseIntPipe) id: number, @Body() newInterestUser: CreateInterestUserDto[]) {
         return this.configurationService.updateSelectInterestUser(id, newInterestUser);
     }
     //crea la relación por defecto entre todos los intereses y un usuario 
     @Post('/interest-user/default/:id')
     createSelectInterestUser(@Param('id', ParseIntPipe) id: number) {
         return this.configurationService.createSelectInterestUser(id);
     }
}

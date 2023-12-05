import { Controller, Get, Post, Body, Delete, Param, Put, ParseIntPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Get()
  getContact() { //Para ver todos los contactos de la bd
    return this.contactService.getContact();
  }
  @Get("user/:id") //Para ver los contactos que tiene un usario
  getContactsUser(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.getContactsUser(id);
  }

  @Post()//Para agregar un contacto a un usuario
  createContactUser(@Body() createContact: CreateContactDto) {
    return this.contactService.createContactUser(createContact);
  }

  @Get(':id')//Obtiene la informacion user del contacto con id
  getOneContact(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.getOneContact(id);
  }

  @Delete(':id')//el id de la tabla contacto
  deleteContact(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.deleteContact(id);
  }

  @Put(':id')//el id de la tabla contacto a actualizar
  updateContact(@Param('id', ParseIntPipe) id: number, @Body() updateContact: UpdateContactDto) {
    return this.contactService.updateContact(id, updateContact);
  }

}

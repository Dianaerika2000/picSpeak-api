import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndividualUser } from 'src/users/entities/individual-user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Chat } from 'src/message/entities/chat.entity';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact) private contactRepository: Repository<Contact>,
        @InjectRepository(IndividualUser) private individualRepository: Repository<IndividualUser>,
        @InjectRepository(Chat) private chatRepository: Repository<Chat>
    ) { }

    async getContact() { //Obtiene todos los contactos
        return { message: 'success', data: await this.contactRepository.find() };
    }

    async getContactsUser(id: number) {
        const userFound = await this.individualRepository.findOne({ where: { id } });

        if (!userFound) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const contactsFound = await this.contactRepository.find({ where: { individualuser: { id } } });

        const chats = await this.chatRepository.createQueryBuilder("chat")
            .leftJoinAndSelect("chat.senderUser", "senderUser")
            .leftJoinAndSelect("chat.receivingUser", "receivingUser")
            .where("chat.senderUser.id = :userId OR chat.receivingUser.id = :userId", { userId: id })
            .getMany();

        let contactsInChats = contactsFound.map(contact => {
            const chatWithContact = chats.find(chat =>
                chat.senderUser.id === contact.contactId || chat.receivingUser.id === contact.contactId
            );
            return { ...contact, chat: chatWithContact };
        });
        contactsInChats = contactsInChats.sort((a, b) => a.nickname.localeCompare(b.nickname));
        return { message: 'success', data: contactsInChats };
    }



    async createContactUser(createContact: CreateContactDto) {
        const userFound = await this.individualRepository.findOne({ where: { id: createContact.user_id } });

        if (!userFound) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Verificar si ya existe un contacto para userFound con el mismo contactId
        const existingContact = await this.contactRepository.findOne({
            where: { contactId: createContact.contactId, individualuser: { id: userFound.id } },
        });

        if (existingContact) {
            return new HttpException('Contact already exists', HttpStatus.CONFLICT);
        }

        const userContactFound = await this.individualRepository.findOne({ where: { id: createContact.contactId } });

        if (!userContactFound) {
            return new HttpException('Contact not found', HttpStatus.NOT_FOUND);
        }

        const existingChatA = await this.chatRepository.findOne({
            where: { senderUser: { id: userFound.id }, receivingUser: { id: userContactFound.id } }
        });
        const existingChatB = await this.chatRepository.findOne({
            where: { senderUser: { id: userContactFound.id }, receivingUser: { id: userFound.id } }
        });

        let newChat = null;
        if (!existingChatA && !existingChatB) {
            newChat = this.chatRepository.create({
                senderUser: userFound,
                receivingUser: userContactFound
            })
            newChat = await this.chatRepository.save(newChat);
        } else {
            if (existingChatA) {
                newChat = existingChatA
            } else {
                newChat = existingChatB
            }
        }
        const newContact = this.contactRepository.create({
            nickname: userContactFound.name,
            contactId: createContact.contactId,
            individualuser: userFound,
            photo_url: userContactFound.photo_url,
        });
        return { message: 'success', data: { contact: await this.contactRepository.save(newContact), chat: newChat } };
    }

    //***** */
    async getOneContact(id: number) {//manda el id del contacto no el contact_id
        const contactFound = await this.contactRepository.findOne({ where: { id } });

        if (!contactFound) {
            return new HttpException('Contact not found', HttpStatus.NOT_FOUND);
        }

        const userId = contactFound.individualuser;

        const userContactFound = await this.individualRepository.findOne({ where: { id: contactFound.contactId } });

        if (!userContactFound) {
            return new HttpException('Contact not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'success', data: { contact: contactFound, user: userContactFound } }
    }

    async updateContact(id: number, updateContact: UpdateContactDto) {
        const contactFound = await this.contactRepository.findOne({ where: { id } });

        if (!contactFound) {
            return new HttpException('Contact not found', HttpStatus.NOT_FOUND);
        }

        // Crear un objeto que contiene solo los campos que deseas actualizar
        const fieldsToUpdate: Partial<Contact> = {};

        if (updateContact.status !== undefined) {
            fieldsToUpdate.status = updateContact.status;
        }

        if (updateContact.nickname !== undefined) {
            fieldsToUpdate.nickname = updateContact.nickname;
        }

        // Actualizar solo los campos especificados
        await this.contactRepository.update(id, fieldsToUpdate);

        // Obtener el contacto actualizado después de la actualización
        const updatedContact = await this.contactRepository.findOne({ where: { id } });

        return { message: 'success', data: updatedContact };
    }


    async deleteContact(id: number) {
        const result = await this.contactRepository.delete({ id });
        if (result.affected === 0) {
            return new HttpException('Contact not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'success' };
    }
}

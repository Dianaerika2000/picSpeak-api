import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { LanguageNacionality } from './entities/language_nacionality.entity';
import { Repository } from 'typeorm';
// import { CreateLanguageNacionalityDto } from './dto/create-language-nacionality.dto';
import { LanguageUser } from './entities/language_user.entity';
import { InterestUser } from './entities/interest_user.entity';
import { InappropriateContentUser } from './entities/inappropriate_content_user.entity';
import { CreateLanguageUserDto } from './dto/create-language-user.dto';
// import { UpdateLanguageUserDto } from './dto/update-language-user.dto';
import { Language } from 'src/language/entities/language.entity';
import { SelectNacionalityUserDto } from './dto/select-nacionality-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Nacionality } from 'src/nacionality/entities/nacionality.entity';
// import { UpdateLanguageNacionalityDto } from './dto/update-language-nacionality.dto';
import { SelectNacionalityMatternLanguageUserDto } from './dto/select-nacionality-mattern-language-user.dto';
import { InappropriateContent } from 'src/inappropriate-content/entities/inappropriate-content.entity';
import { CreateInappropriateContentUserDto } from './dto/create-inappropriate-content-user.dto';
import { Interest } from 'src/interest/entities/interest.entity';
import { CreateInterestUserDto } from './dto/create-interest-user.dto';
import { SelectNacionalityLanguageUserDto } from './dto/select-nacionality-language.dto';
// import { SelectNacionalityLanguageUserDto } from './dto/select-nacionality-language-user.dto';

@Injectable()
export class ConfigurationService {
    constructor(
        @InjectRepository(Nacionality) private nacionalityRepository: Repository<Nacionality>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Language) private languageRepository: Repository<Language>,
        @InjectRepository(InappropriateContent) private inappropriateContentRepository: Repository<InappropriateContent>,
        @InjectRepository(Interest) private interestRepository: Repository<Interest>,
        // @InjectRepository(LanguageNacionality) private languageNacionalityRepository: Repository<LanguageNacionality>,
        @InjectRepository(LanguageUser) private languageUserRepository: Repository<LanguageUser>,
        @InjectRepository(InterestUser) private interestUserRepository: Repository<InterestUser>,
        @InjectRepository(InappropriateContentUser) private inappropriateContentUserRepository: Repository<InappropriateContentUser>
    ) { }
    //LANGUAGE NACIONALITY

    // async getLanguagesNacionality(id: number) {
    //     const nacionalityFound = await this.nacionalityRepository.findOne({ where: { id } });
    //     if (!nacionalityFound) {
    //         return new HttpException('Nacionality not found', HttpStatus.NOT_FOUND)
    //     }
    //     const languages = await this.languageNacionalityRepository.find({
    //         where: { nacionality: { id } },
    //         relations: ['language'],
    //     });

    //     return { message: "succes", data: languages }
    // }
    // async getLanguagesNacionalities() {
    //     const languages = await this.nacionalityRepository
    //         .createQueryBuilder('nacionality')
    //         .leftJoinAndSelect('nacionality.languageNacionalities', 'languageNacionalities')
    //         .leftJoinAndSelect('languageNacionalities.language', 'language') // Agrega esto para cargar la relación 'language'
    //         .getMany();
    //     return { message: "success", data: languages }
    // }


    // async createLanguageNacionality(id: number, languageNacionality: CreateLanguageNacionalityDto) {
    //     const nacionalityFound = await this.nacionalityRepository.findOne({ where: { id } });
    //     if (!nacionalityFound) {
    //         return new HttpException('Nacionalidad no encontrada', HttpStatus.NOT_FOUND);
    //     }

    //     const languageFound = await this.languageRepository.findOne({ where: { id: languageNacionality.language_id } });
    //     if (!languageFound) {
    //         return new HttpException('Lenguaje no encontrada', HttpStatus.NOT_FOUND);
    //     }

    //     const languageNacionalityFound = await this.languageNacionalityRepository.findOne({
    //         where: {
    //             language: { id: languageNacionality.language_id },
    //             nacionality: { id }
    //         }
    //     })

    //     if (languageNacionalityFound) {
    //         return new HttpException('Lenguaje ya está registrado a la nacionalidad', HttpStatus.CONFLICT);
    //     }
    //     const newLanguageNacionality = this.languageNacionalityRepository.create({
    //         language: { id: languageNacionality.language_id }, // Accede a language_id dentro de la propiedad language
    //         nacionality: { id: id } // Accede a nacionality_id directamente
    //     });
    //     return { message: 'success', data: await this.languageNacionalityRepository.save(newLanguageNacionality) };
    // }

    // async updateLanguageNacionality(id: number, languageNacionality: UpdateLanguageNacionalityDto) {
    //     const nacionalityFound = await this.nacionalityRepository.findOne({ where: { id } });
    //     if (!nacionalityFound) {
    //         return new HttpException('Nacionalidad no encontrada', HttpStatus.NOT_FOUND);
    //     }

    //     const languageFound = await this.languageRepository.findOne({ where: { id: languageNacionality.language_id } });
    //     if (!languageFound) {
    //         return new HttpException('Lenguaje no encontrada', HttpStatus.NOT_FOUND);
    //     }

    //     const languageNacionalityFound = await this.languageNacionalityRepository.findOne({
    //         where: {
    //             language: { id: languageNacionality.language_id },
    //             nacionality: { id }
    //         }
    //     })
    //     if (!languageNacionalityFound) {
    //         return new HttpException('Lenguaje no encontrado en la nacionalidad', HttpStatus.NOT_FOUND)
    //     }

    //     languageNacionalityFound.status = languageNacionality.status;

    //     return { message: "success", data: this.languageNacionalityRepository.save(languageNacionalityFound) };
    // }
    //LANGUAGE USER
    async createSelectLanguageUser(id: number) {
        const promesaLanguageUser = [];
        const languages = await this.languageRepository.find();
        const languageUserFound = await this.languageUserRepository.find({
            where: { user: { id } }
        })

        if (languageUserFound.length === 0) {
            languages.forEach(async (e) => {
                const newLanguageUser = this.languageUserRepository.create({
                    language: { id: e.id }, // Asigna el ID del idioma
                    user: { id: id }, // Asigna el ID del usuario proporcionado
                });
                promesaLanguageUser.push(this.languageUserRepository.save(newLanguageUser));
            });
            await Promise.all(promesaLanguageUser);
            return "se inicializó correctamente";
        } else {
            return "ya está creado sus lenguajes para el usuario";
        }
    }

    async updateSelectLanguageUser(id: number, languageUser: CreateLanguageUserDto[]) {
        const promesaObtencion = [];
        const languageUserFound = await this.languageUserRepository.find({
            where: {
                status: true,
                user: { id }
            }
        })
        languageUserFound.forEach(async (e) => {
            e.status = false;
            promesaObtencion.push(this.languageUserRepository.save(e));
        });
        await Promise.all(promesaObtencion);

        const promesasDeActualizacion = [];
        languageUser.forEach(async (e) => {
            const registroEncontrado = await this.languageUserRepository.findOne({
                where: { user: { id }, language: { id: e.language_id } },
            });
            if (registroEncontrado) {
                // Actualizar los campos con los valores del objeto
                registroEncontrado.status = e.status;
                // Guardar la promesa de actualización en el array
                promesasDeActualizacion.push(this.languageUserRepository.save(registroEncontrado));
            }
        });
        // Esperar a que todas las promesas se resuelvan
        await Promise.all(promesasDeActualizacion);

        return { message: 'success' };
    }

    async getLanguagesUser(id: number) {
        const userFound = await this.userRepository.findOne({ where: { id } });
        if (!userFound) {
            return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
        }

        const languageUserFound = await this.languageUserRepository.find({
            where: { status: true, user: { id } },
            relations: ['language'],
        })
        return { message: 'success', data: languageUserFound };
    }

    async selectNacionalityUser(id: number, selectNacionalityUser: SelectNacionalityUserDto) {
        const userFound = await this.userRepository.findOne({ where: { id }, relations: ['nacionality'] });
        if (!userFound) {
            return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
        }
        const nacionalityFound = await this.nacionalityRepository.findOne({ where: { id: selectNacionalityUser.nacionality_id } });
        if (!nacionalityFound) {
            return new HttpException('Nacionalidad no encontrada', HttpStatus.NOT_FOUND);
        }
        userFound.nacionality = nacionalityFound;

        return { message: "success", data: await this.userRepository.save(userFound) };
    }

    async selectMatternLanguage(id: number, selectNacionalityMatternLanguageUser: SelectNacionalityMatternLanguageUserDto) {
        const userFound = await this.userRepository.findOne({ where: { id }, relations: ['nacionality'] });
        if (!userFound) {
            return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
        }
        const languageFound = await this.languageRepository.findOne({ where: { id: selectNacionalityMatternLanguageUser.language_id } });
        if (!languageFound) {
            return new HttpException('Lenguaje no encontrada', HttpStatus.NOT_FOUND);
        }

        const languageUserFound = await this.languageUserRepository.findOne({
            where: { matern_language: true, user: { id } },
        })
        languageUserFound.matern_language = false;
        Promise.all([await this.languageUserRepository.save(languageUserFound)]);
        const newMatternLanguageUser = await this.languageUserRepository.findOne({
            where: { user: { id }, language: { id: selectNacionalityMatternLanguageUser.language_id } }
        })
        if (!newMatternLanguageUser) {
            return new HttpException('Lenguaje o usuario no son válidos', HttpStatus.CONFLICT);
        }
        newMatternLanguageUser.matern_language = true;
        newMatternLanguageUser.status = true;
        return { message: "success", data: await this.languageUserRepository.save(newMatternLanguageUser) };
    }

    async selectLanguageNationalityUser(id: number, selectLanguageNationalityUser: SelectNacionalityLanguageUserDto) {
        const userFound = await this.userRepository.findOne({ where: { id }, relations: ['nacionality'] });
        if (!userFound) {
            return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
        }

        const languageFound = await this.languageRepository.findOne({ where: { id: selectLanguageNationalityUser.language_id } });
        if (!languageFound) {
            return new HttpException('Lenguaje no encontrada', HttpStatus.NOT_FOUND);
        }

        const nacionalityFound = await this.nacionalityRepository.findOne({ where: { id: selectLanguageNationalityUser.nationality_id } });
        if (!nacionalityFound) {
            return new HttpException('Nacionalidad no encontrada', HttpStatus.NOT_FOUND);
        }

        const languageUserFound = await this.languageUserRepository.findOne({
            where: { matern_language: true, user: { id } },
        })
        //  return { message: "lenguaje usuario", data: languageUserFound }
        if (languageUserFound) { //quiere decir que hay un language user con matern language registrado
            //return "ingresa true";
            languageUserFound.status = false;
            languageUserFound.matern_language = false;
            Promise.all([await this.languageUserRepository.save(languageUserFound)]);//coloca en false al language user seleccionado anteriormente

            const newMatternLanguageUser = await this.languageUserRepository.findOne({
                where: { user: { id }, language: { id: selectLanguageNationalityUser.language_id } }
            })

            if (!newMatternLanguageUser) {
                userFound.nacionality = nacionalityFound;
                const newLanguageUser = this.languageUserRepository.create({
                    status: true,
                    matern_language: true,
                    language: { id: selectLanguageNationalityUser.language_id }, // Asigna el ID del idioma
                    user: { id: id }, // Asigna el ID del usuario proporcionado
                });

                return { message: "success", data: [await this.languageUserRepository.save(newLanguageUser), await this.userRepository.save(userFound)] };
            } else {

                newMatternLanguageUser.matern_language = true;
                newMatternLanguageUser.status = true;

                userFound.nacionality = nacionalityFound;
                return { message: "success true", data: [await this.languageUserRepository.save(newMatternLanguageUser), await this.userRepository.save(userFound)] };
            }
        } else {//quiere decir que no hay y entonces crearemos uno
            //   return "ingresa false";
            return "no hay user language";
        }


    }
    //INTEREST USER
    async getInterestsUser(id: number) {
        const userFound = await this.userRepository.findOne({ where: { id } });
        if (!userFound) {
            return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
        }

        const interestsFound = await this.interestUserRepository.find({
            where: { status: true, user: { id } },
            relations: ['interest'],
        })
        return { message: "success", data: interestsFound };
    }
    async createSelectInterestUser(id: number) {
        const promesaIterestUser = [];
        const interests = await this.interestRepository.find();
        const interestUsersFound = await this.interestUserRepository.find({
            where: { user: { id } }
        })

        if (interestUsersFound.length === 0) {
            interests.forEach(async (e) => {
                const newInterestUser = this.interestUserRepository.create({
                    interest: { id: e.id }, // Asigna el ID del interest
                    user: { id: id }, // Asigna el ID del usuario proporcionado
                });
                promesaIterestUser.push(this.interestUserRepository.save(newInterestUser));
            });
            await Promise.all(promesaIterestUser);
            return { message: "success" };
        } else {
            return { message: "nothing" };
        }
    }
    async updateSelectInterestUser(id: number, interestUser: CreateInterestUserDto[]) {
        const promesaObtencion = [];
        const interestUserFound = await this.interestUserRepository.find({
            where: {
                status: true,
                user: { id }
            }
        })
        interestUserFound.forEach(async (e) => {
            e.status = false;
            promesaObtencion.push(this.interestUserRepository.save(e));
        });
        await Promise.all(promesaObtencion);

        const promesasDeActualizacion = [];
        interestUser.forEach(async (e) => {
            const registroEncontrado = await this.interestUserRepository.findOne({
                where: { user: { id }, interest: { id: e.interest_id } },
            });
            if (registroEncontrado) {
                // Actualizar los campos con los valores del objeto
                registroEncontrado.status = e.status;
                // Guardar la promesa de actualización en el array
                promesasDeActualizacion.push(this.interestUserRepository.save(registroEncontrado));
            }
        });
        // Esperar a que todas las promesas se resuelvan
        await Promise.all(promesasDeActualizacion);

        return { message: "success" };
    }
    //INAPPROPRIATE CONTENT USER
    async getInappropriateContentUser(id: number) {
        const userFound = await this.userRepository.findOne({ where: { id } });
        if (!userFound) {
            return new HttpException('Usuario no encontrada', HttpStatus.NOT_FOUND);
        }

        const inappropriateFound = await this.inappropriateContentUserRepository.find({
            where: { status: true, user: { id } },
            relations: ['inappropriate_content'],
        })
        return inappropriateFound;
    }
    async createSelectInappropriateContentUser(id: number) {
        const promesaInappropriateContentUser = [];
        const inappropriateContent = await this.inappropriateContentRepository.find();
        const inappropriateContentUsersFound = await this.inappropriateContentUserRepository.find({
            where: { user: { id } }
        })

        if (inappropriateContentUsersFound.length === 0) {
            inappropriateContent.forEach(async (e) => {
                const newInappropriateContentUser = this.inappropriateContentUserRepository.create({

                    inappropiateContent: { id: e.id }, // Asigna el ID del contenido inapropiado
                    user: { id: id }, // Asigna el ID del usuario proporcionado
                });
                promesaInappropriateContentUser.push(this.inappropriateContentUserRepository.save(newInappropriateContentUser));
            });
            await Promise.all(promesaInappropriateContentUser);
            return { message: "success" };
        } else {
            return { message: "nothing" };
        }
    }
    async updateSelectInappropriateContentUser(id: number, inappropriateContentUser: CreateInappropriateContentUserDto[]) {
        const promesaObtencion = [];
        const inappropriateContentUserFound = await this.inappropriateContentUserRepository.find({
            where: {
                status: true,
                user: { id }
            }
        })
        inappropriateContentUserFound.forEach(async (e) => {
            e.status = false;
            promesaObtencion.push(this.inappropriateContentUserRepository.save(e));
        });
        await Promise.all(promesaObtencion);

        const promesasDeActualizacion = [];
        inappropriateContentUser.forEach(async (e) => {
            const registroEncontrado = await this.inappropriateContentUserRepository.findOne({
                where: { user: { id }, inappropiateContent: { id: e.inappropriate_content_id } },
            });
            if (registroEncontrado) {
                // Actualizar los campos con los valores del objeto
                registroEncontrado.status = e.status;
                // Guardar la promesa de actualización en el array
                promesasDeActualizacion.push(this.inappropriateContentUserRepository.save(registroEncontrado));
            }
        });
        // Esperar a que todas las promesas se resuelvan
        await Promise.all(promesasDeActualizacion);

        return { message: 'success' };
    }
}

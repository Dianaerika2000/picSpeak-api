import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { IndividualUsersModule } from './individual-users/individual-users.module';
import { AuthModule } from './auth/auth.module';
import { NacionalityModule } from './nacionality/nacionality.module';
import { LanguageModule } from './language/language.module';
import { InterestModule } from './interest/interest.module';
import { InappropriateContentModule } from './inappropriate-content/inappropriate-content.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        logging: true,
        autoLoadEntities: false,//cambiar a true para sincronizar con la bd
        synchronize: true, 
        cache: false
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    IndividualUsersModule,
    AuthModule,
    NacionalityModule,
    LanguageModule,
    InterestModule,
    InappropriateContentModule,
    ConfigurationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

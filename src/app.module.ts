import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NacionalityModule } from './nacionality/nacionality.module';
import { LanguageModule } from './language/language.module';
import { InterestModule } from './interest/interest.module';
import { InappropriateContentModule } from './inappropriate-content/inappropriate-content.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { MailModule } from './mail/mail.module';
import { ResourcesModule } from './resources/resources.module';
import { ChatGptAiModule } from './chat-gpt-ai/chat-gpt-ai.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { ContactModule } from './contact/contact.module';
import { StatusModule } from './status/status.module';
import { StatusIndividualUserModule } from './status-individual-user/status-individual-user.module';
import { AwsModule } from './aws/aws.module';
import { GoogleCloudModule } from './google-cloud/google-cloud.module';

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
        entities: ['dist/src/**/*.entity{.ts,.js}'],
        logging: true,
        autoLoadEntities: true,
        synchronize: true,
        cache: false,
        /* ssl: {
          rejectUnauthorized: false,
        }, */
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    NacionalityModule,
    LanguageModule,
    InterestModule,
    InappropriateContentModule,
    ConfigurationModule,
    MailModule,
    ResourcesModule,
    ChatGptAiModule,
    ChatModule,
    MessageModule,
    ContactModule,
    StatusModule,
    StatusIndividualUserModule,
    AwsModule,
    GoogleCloudModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

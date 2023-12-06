# Diff Details

Date : 2023-12-05 15:18:03

Directory d:\\2-2023\\SOFTWARE 1\\PROYECTO_DE_LA_MATERIA\\PICSPEAK\\nuevo\\picSpeak-api

Total : 60 files,  1606 codes, 142 comments, 334 blanks, all 2082 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.dockerignore](/.dockerignore) | Ignore | 2 | 0 | 1 | 3 |
| [Dockerfile](/Dockerfile) | Docker | 8 | 0 | 7 | 15 |
| [package-lock.json](/package-lock.json) | JSON | 426 | 0 | 0 | 426 |
| [package.json](/package.json) | JSON | 5 | 0 | 0 | 5 |
| [src/app.module.ts](/src/app.module.ts) | TypeScript | 13 | 3 | 0 | 16 |
| [src/auth/auth.module.ts](/src/auth/auth.module.ts) | TypeScript | 2 | 0 | 0 | 2 |
| [src/auth/auth.service.ts](/src/auth/auth.service.ts) | TypeScript | -13 | 0 | -3 | -16 |
| [src/auth/dto/register.dto.ts](/src/auth/dto/register.dto.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/aws/aws.controller.ts](/src/aws/aws.controller.ts) | TypeScript | 25 | 0 | 7 | 32 |
| [src/aws/aws.module.ts](/src/aws/aws.module.ts) | TypeScript | 9 | 0 | 2 | 11 |
| [src/aws/aws.service.ts](/src/aws/aws.service.ts) | TypeScript | 79 | 5 | 17 | 101 |
| [src/chat-gpt-ai/chat-gpt-ai.module.ts](/src/chat-gpt-ai/chat-gpt-ai.module.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/chat/chat.controller.ts](/src/chat/chat.controller.ts) | TypeScript | 20 | 0 | 7 | 27 |
| [src/chat/chat.gateway.spec.ts](/src/chat/chat.gateway.spec.ts) | TypeScript | 15 | 0 | 5 | 20 |
| [src/chat/chat.gateway.ts](/src/chat/chat.gateway.ts) | TypeScript | 79 | 59 | 36 | 174 |
| [src/chat/chat.module.ts](/src/chat/chat.module.ts) | TypeScript | 19 | 0 | 2 | 21 |
| [src/chat/chat.service.spec.ts](/src/chat/chat.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/chat/chat.service.ts](/src/chat/chat.service.ts) | TypeScript | 106 | 14 | 20 | 140 |
| [src/configuration/entities/interest_user.entity.ts](/src/configuration/entities/interest_user.entity.ts) | TypeScript | 0 | -3 | 0 | -3 |
| [src/configuration/entities/language_user.entity.ts](/src/configuration/entities/language_user.entity.ts) | TypeScript | 0 | -3 | -1 | -4 |
| [src/contact/contact.controller.ts](/src/contact/contact.controller.ts) | TypeScript | 34 | 0 | 8 | 42 |
| [src/contact/contact.module.ts](/src/contact/contact.module.ts) | TypeScript | 12 | 0 | 2 | 14 |
| [src/contact/contact.service.ts](/src/contact/contact.service.ts) | TypeScript | 83 | 5 | 31 | 119 |
| [src/contact/dto/create-contact.dto.ts](/src/contact/dto/create-contact.dto.ts) | TypeScript | 7 | 0 | 3 | 10 |
| [src/contact/dto/update-contact.dto.ts](/src/contact/dto/update-contact.dto.ts) | TypeScript | 7 | 0 | 2 | 9 |
| [src/contact/entities/contact.entity.ts](/src/contact/entities/contact.entity.ts) | TypeScript | 22 | 1 | 7 | 30 |
| [src/main.ts](/src/main.ts) | TypeScript | -4 | 5 | 1 | 2 |
| [src/message/dto/create-chat.dto.ts](/src/message/dto/create-chat.dto.ts) | TypeScript | 14 | 0 | 1 | 15 |
| [src/message/dto/create-message.dto.ts](/src/message/dto/create-message.dto.ts) | TypeScript | 16 | 0 | 4 | 20 |
| [src/message/dto/update-message.dto.ts](/src/message/dto/update-message.dto.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [src/message/entities/chat.entity.ts](/src/message/entities/chat.entity.ts) | TypeScript | 22 | 2 | 9 | 33 |
| [src/message/entities/message.entity.ts](/src/message/entities/message.entity.ts) | TypeScript | 25 | 4 | 10 | 39 |
| [src/message/message.controller.ts](/src/message/message.controller.ts) | TypeScript | 30 | 0 | 7 | 37 |
| [src/message/message.module.ts](/src/message/message.module.ts) | TypeScript | 20 | 0 | 3 | 23 |
| [src/message/message.service.ts](/src/message/message.service.ts) | TypeScript | 57 | 4 | 13 | 74 |
| [src/resources/dto/create-image.dto.ts](/src/resources/dto/create-image.dto.ts) | TypeScript | 8 | 0 | 3 | 11 |
| [src/resources/dto/create-resource.dto.ts](/src/resources/dto/create-resource.dto.ts) | TypeScript | 4 | 0 | 2 | 6 |
| [src/resources/dto/create-text.dto.ts](/src/resources/dto/create-text.dto.ts) | TypeScript | 14 | 0 | 6 | 20 |
| [src/resources/entities/image.entity.ts](/src/resources/entities/image.entity.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [src/resources/entities/resource.entity.ts](/src/resources/entities/resource.entity.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/resources/entities/text.entity.ts](/src/resources/entities/text.entity.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/resources/resources.controller.ts](/src/resources/resources.controller.ts) | TypeScript | -11 | 11 | 0 | 0 |
| [src/resources/resources.module.ts](/src/resources/resources.module.ts) | TypeScript | 8 | 0 | 0 | 8 |
| [src/resources/resources.service.ts](/src/resources/resources.service.ts) | TypeScript | -2 | 15 | 6 | 19 |
| [src/status-individual-user/dto/create-status-individual-user.dto.ts](/src/status-individual-user/dto/create-status-individual-user.dto.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [src/status-individual-user/dto/update-status-individual-user.dto.ts](/src/status-individual-user/dto/update-status-individual-user.dto.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [src/status-individual-user/entities/status-individual-user.entity.ts](/src/status-individual-user/entities/status-individual-user.entity.ts) | TypeScript | 22 | 0 | 9 | 31 |
| [src/status-individual-user/status-individual-user.controller.ts](/src/status-individual-user/status-individual-user.controller.ts) | TypeScript | 24 | 2 | 5 | 31 |
| [src/status-individual-user/status-individual-user.module.ts](/src/status-individual-user/status-individual-user.module.ts) | TypeScript | 12 | 0 | 2 | 14 |
| [src/status-individual-user/status-individual-user.service.ts](/src/status-individual-user/status-individual-user.service.ts) | TypeScript | 85 | 13 | 19 | 117 |
| [src/status/dto/create-status.dto.ts](/src/status/dto/create-status.dto.ts) | TypeScript | 9 | 0 | 2 | 11 |
| [src/status/dto/update-status.dto.ts](/src/status/dto/update-status.dto.ts) | TypeScript | 9 | 0 | 2 | 11 |
| [src/status/entities/status.entity.ts](/src/status/entities/status.entity.ts) | TypeScript | 17 | 0 | 8 | 25 |
| [src/status/status.controller.ts](/src/status/status.controller.ts) | TypeScript | 35 | 0 | 8 | 43 |
| [src/status/status.module.ts](/src/status/status.module.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/status/status.service.ts](/src/status/status.service.ts) | TypeScript | 67 | 0 | 15 | 82 |
| [src/users/entities/individual-user.entity.ts](/src/users/entities/individual-user.entity.ts) | TypeScript | 14 | 1 | 4 | 19 |
| [src/users/users.controller.ts](/src/users/users.controller.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/users/users.module.ts](/src/users/users.module.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [src/users/users.service.ts](/src/users/users.service.ts) | TypeScript | 76 | 4 | 19 | 99 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details
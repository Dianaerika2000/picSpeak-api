import { PartialType } from '@nestjs/swagger';
import { CreateIndividualUserDto } from './create-individual-user.dto';

export class UpdateIndividualUserDto extends PartialType(CreateIndividualUserDto) {}

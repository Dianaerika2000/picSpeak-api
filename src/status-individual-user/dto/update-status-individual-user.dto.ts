import { PartialType } from '@nestjs/swagger';
import { CreateStatusIndividualUserDto } from './create-status-individual-user.dto';

export class UpdateStatusIndividualUserDto extends PartialType(CreateStatusIndividualUserDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateHealthyEatingDto } from './create-healthy-eating.dto';

export class UpdateHealthyEatingDto extends PartialType(CreateHealthyEatingDto) {}

import { PartialType } from "@nestjs/swagger";
import { ViewUserDto } from "./view-user-dto";
export class UpdateUserDto extends PartialType(ViewUserDto) {}

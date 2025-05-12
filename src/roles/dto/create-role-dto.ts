import { ApiProperty } from "@nestjs/swagger";
import { RolesEnum } from "src/enum/Roles";

export class CreateRoleDto {
  @ApiProperty({
    example: RolesEnum.MANAGER,
    description: "Название роли",
    enum: RolesEnum,
  })
  readonly value: string;
  @ApiProperty({ example: "Менеджер", description: "Описание роли" })
  readonly description: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { RolesEnum } from "src/enum/Roles";

export class GetRoleDto {
  @ApiProperty({ example: RolesEnum.MANAGER, description: "Название роли" })
  readonly value: keyof typeof RolesEnum;
}

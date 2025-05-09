import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { RolesEnum } from "src/enum/Roles";

export class AddRoleDto {
  @ApiProperty({ example: RolesEnum.MANAGER, description: "Название роли" })
  @IsString({ message: "Должно быть строкой" })
  readonly value: keyof typeof RolesEnum;
  @ApiProperty({ example: 1, description: "ID пользователя" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly id: number;
}

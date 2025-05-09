import { ApiProperty } from "@nestjs/swagger";
import { RolesEnum } from "src/enum/Roles";

export class ViewUserDto {
  @ApiProperty({ example: 1, description: "ID" })
  id: number;
  @ApiProperty({ example: "user@mail.ru", description: "email" })
  email: string;
  @ApiProperty({
    example: [RolesEnum.MANAGER, RolesEnum.USER],
    description: "Массив ролей пользователя",
  })
  roles: string[];
}

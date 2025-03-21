import { ApiProperty } from "@nestjs/swagger";

export class ViewUserDto {
  @ApiProperty({ example: 1, description: "ID" })
  id: number;
  @ApiProperty({ example: "user@mail.ru", description: "email" })
  email: string;
  @ApiProperty({
    example: ["ADMIN", "USER"],
    description: "Массив ролей пользователя",
  })
  roles: string[];
}

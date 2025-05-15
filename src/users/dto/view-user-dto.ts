import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Max, Min } from "class-validator";

import { RolesEnum } from "src/enum/Roles";
import { Sex } from "src/enum/Sex";

export class ViewUserDto {
  @ApiProperty({ example: 1, description: "ID" })
  id: number;

  @ApiProperty({ example: "user@mail.ru", description: "email" })
  email: string;

  @ApiProperty({
    example: [RolesEnum.MANAGER, RolesEnum.USER],
    description: "Массив ролей пользователя",
  })
  roles: RolesEnum[];

  @ApiProperty({
    example: "FEMALE",
    description: "Пол пользователя",
    enum: Sex,
  })
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty({
    example: 165,
    description: "Рост в см",
    minimum: 50,
    maximum: 250,
  })
  @IsInt()
  @Min(50)
  @Max(250)
  height: number;

  @ApiProperty({
    example: 75,
    description: "Вес в кг",
    minimum: 20,
    maximum: 300,
  })
  @IsInt()
  @Min(20)
  @Max(300)
  weight: number;

  @ApiProperty({
    example: 18,
    description: "Возраст",
    minimum: 12,
    maximum: 120,
  })
  @IsInt()
  @Min(12)
  @Max(120)
  age: number;

  @ApiProperty({
    example: 2200,
    description: "Ккал",
  })
  @IsInt()
  kalNorm?: number | null;

  @ApiProperty({ example: "uuid", description: "файл" })
  readonly avatar: string;
}

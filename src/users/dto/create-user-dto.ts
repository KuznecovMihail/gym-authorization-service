import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "user@mail.ru", description: "email" })
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email: string;

  @ApiProperty({ example: "qwerty", description: "Пароль" })
  @IsString({ message: "Должно быть строкой" })
  @Length(4, 20, { message: "Пароль должен состоять от 4 до 20 символов" })
  readonly password: string;
}

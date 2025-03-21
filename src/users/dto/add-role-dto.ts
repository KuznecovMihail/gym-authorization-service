import { IsNumber, IsString } from "class-validator";

export class AddRoleDto {
  @IsString({ message: "Должно быть строкой" })
  readonly value: keyof typeof RolesEnum;
  @IsNumber({}, { message: "Должно быть числом" })
  readonly id: number;
}

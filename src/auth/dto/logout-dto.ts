import { ApiProperty } from "@nestjs/swagger";

export class LogoutDto {
  @ApiProperty({
    example: "1",
    description: "Id Пользователя",
  })
  readonly userId: number;
}

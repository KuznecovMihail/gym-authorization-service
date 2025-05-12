import { ApiProperty } from "@nestjs/swagger";

export class CreateUserRoleDto {
  @ApiProperty({ example: 1, description: "User ID" })
  readonly userId: number;

  @ApiProperty({ example: 1, description: "Role ID" })
  readonly roleId: number;
}

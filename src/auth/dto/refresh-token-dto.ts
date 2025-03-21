import { ApiProperty } from "@nestjs/swagger";

export class refreshTokenDto {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQyNDg2MDUxLCJleHAiOjE3NDI1NzI0NTF9.mQxxNUKHL6d8wQB0dkLnS0qyqabeUiGGXfeY5KStMME",
    description: "refreshToken",
  })
  readonly refreshToken: string;
}

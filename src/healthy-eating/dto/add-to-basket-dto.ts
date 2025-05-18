import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class AddToBasketDto {
  @ApiProperty({ example: 1, description: "Id продукта" })
  @IsNumber()
  @Min(1)
  itemId: number;
}

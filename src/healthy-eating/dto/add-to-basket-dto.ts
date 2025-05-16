import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class AddToBasketDto {
  @ApiProperty({ example: 1, description: "Id продукта" })
  @IsNumber()
  @Min(1)
  itemId: number;

  @ApiProperty({ example: 2, description: "Количество" })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;
}

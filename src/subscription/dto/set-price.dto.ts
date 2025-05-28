import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";
export class SetPriceDto {
  @ApiProperty({ example: "morning", description: "Тип (утро, день, вечер)" })
  @IsString()
  type: string;

  @ApiProperty({ example: 1800, description: "Стоимость для клиента" })
  @IsInt()
  @Min(0)
  trainerPrice: number;
}

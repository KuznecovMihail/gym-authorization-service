import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";
export class CreateSubscriptionDto {
  @ApiProperty({
    example: "girl",
    description: "Глобальный тип (например, пол)",
  })
  @IsString()
  globalType: string;

  @ApiProperty({ example: "morning", description: "Тип (утро, день, вечер)" })
  @IsString()
  type: string;

  @ApiProperty({ example: "8:00", description: "Время начала слота" })
  @IsString()
  timeStart: string;

  @ApiProperty({ example: "12:00", description: "Время окончания слота" })
  @IsString()
  timeEnd: string;

  @ApiProperty({ example: 1800, description: "Стоимость для клиента" })
  @IsInt()
  @Min(0)
  price: number;
}

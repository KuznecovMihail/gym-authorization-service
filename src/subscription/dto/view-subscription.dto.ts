import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, Min } from "class-validator";

export class ViewSubscriptionDto {
  @ApiProperty({ example: 1, description: "ID" })
  id: number;

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

  @ApiProperty({ example: 4000, description: "Стоимость для тренера" })
  @IsInt()
  @Min(0)
  trainerPrice: number;
}

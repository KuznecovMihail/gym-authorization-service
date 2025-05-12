import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class MealNutrientsDto {
  @ApiProperty({ example: 5, description: "Белки (г)" })
  @IsInt()
  @IsPositive()
  squirrels: number;

  @ApiProperty({ example: 10, description: "Жиры (г)" })
  @IsInt()
  @IsPositive()
  fats: number;

  @ApiProperty({ example: 35, description: "Углеводы (г)" })
  @IsInt()
  @IsPositive()
  carbohydrates: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class MealTotalsDto {
  @ApiProperty({ example: 1120, description: "Общее количество калорий" })
  @IsInt()
  @IsPositive()
  calories: number;

  @ApiProperty({ example: 78, description: "Общее количество белков (г)" })
  @IsInt()
  @IsPositive()
  squirrels: number;

  @ApiProperty({ example: 57, description: "Общее количество жиров (г)" })
  @IsInt()
  @IsPositive()
  fats: number;

  @ApiProperty({ example: 63, description: "Общее количество углеводов (г)" })
  @IsInt()
  @IsPositive()
  carbohydrates: number;
}

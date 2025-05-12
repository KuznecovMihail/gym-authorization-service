import { ApiProperty } from "@nestjs/swagger";
import { MealInfoDto } from "./meal-info-dto";
import { IsInt, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { MealTotalsDto } from "./meal-totals-dto";

export class MealPlanResponseDto {
  @ApiProperty({
    type: () => ({
      breakfast: { type: () => MealInfoDto },
      lunch: { type: () => MealInfoDto },
      dinner: { type: () => MealInfoDto },
    }),
    description: "Приемы пищи",
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  meals: {
    breakfast: MealInfoDto;
    lunch: MealInfoDto;
    dinner: MealInfoDto;
  };

  @ApiProperty({ type: MealTotalsDto, description: "Итоговые значения" })
  @IsObject()
  @ValidateNested()
  @Type(() => MealTotalsDto)
  totals: MealTotalsDto;

  @ApiProperty({
    example: 6,
    description: "Процент отклонения от целевых калорий",
  })
  @IsInt()
  deviationPercentage: number;
}

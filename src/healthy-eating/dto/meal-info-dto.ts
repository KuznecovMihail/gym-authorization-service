import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNumber,
  IsObject,
  IsPositive,
  ValidateNested,
} from "class-validator";
import { MealNutrientsDto } from "./meal-nutrients-dto";
import { Type } from "class-transformer";

export class MealInfoDto {
  @ApiProperty({ example: 1, description: "ID блюда" })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    example: "Каша рисовая на кокосовом молоке с манго",
    description: "Название блюда",
  })
  title: string;

  @ApiProperty({ example: 250, description: "Калории" })
  @IsInt()
  @IsPositive()
  calories: number;

  @ApiProperty({
    example: "Рис, кокосовое молоко, манго, мед, корица",
    description: "Состав",
  })
  compound: string;

  @ApiProperty({
    example: "https://example.com/image.jpg",
    description: "Ссылка на изображение",
    required: false,
  })
  image?: string;

  @ApiProperty({ example: 999, description: "Цена в рублях" })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ type: MealNutrientsDto, description: "Пищевая ценность" })
  @IsObject()
  @ValidateNested()
  @Type(() => MealNutrientsDto)
  nutrients: MealNutrientsDto;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNumber, IsPositive, IsString } from "class-validator";
import { EatingType } from "src/enum/EatingType";

export class HealthyEatingDto {
  @ApiProperty({ example: 1, description: "Уникальный идентификатор" })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    example: "Овсяная каша с фруктами",
    description: "Название блюда",
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "Овсяные хлопья, банан, мед, грецкие орехи",
    description: "Состав блюда",
  })
  @IsString()
  compound: string;

  @ApiProperty({ example: 250, description: "Калорийность (ккал)" })
  @IsInt()
  @IsPositive()
  kcal: number;

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

  @ApiProperty({ example: "299.99", description: "Цена (руб)" })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: "1d148962-9309-4022-859d-0969d9b5efb6.jpg",
    description: "Фото блюда",
  })
  @IsString()
  image: string;

  @ApiProperty({
    enum: EatingType,
    example: EatingType.BREAKFAST,
    description: "Тип приема пищи",
  })
  @IsEnum(EatingType)
  eatingType: EatingType;

  @ApiProperty({ example: 1, description: "ID пользователя-автора" })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({ example: 1, description: "Количестов в корзине" })
  @IsInt()
  @IsPositive()
  inBasketQuantity?: number;
}

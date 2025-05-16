import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateHealthyEatingDto {
  @ApiProperty({ example: "Каша рисовая на кокосовом молоке с манго" })
  @IsString({ message: "Должно быть строкой" })
  @IsNotEmpty({ message: "Название не должно быть пустым" })
  readonly title: string;

  @ApiProperty({
    example: "Состав: Крупа рис, молоко кокосовое...",
    description: "Состав",
  })
  @IsString({ message: "Должно быть строкой" })
  @IsNotEmpty({ message: "Состав не должен быть пустым" })
  readonly compound: string;

  @ApiProperty({ example: 250, description: "Калории (целое число)" })
  //@IsInt({ message: "Должно быть целым числом" })
  @IsNotEmpty({ message: "Калории не должны быть пустыми" })
  readonly kcal: number;

  @ApiProperty({ example: 5, description: "Белки (г, целое число)" })
  //@IsInt({ message: "Должно быть целым числом" })
  @IsNotEmpty({ message: "Укажите количество белков" })
  readonly squirrels: number;

  @ApiProperty({ example: 10, description: "Жиры (г, целое число)" })
  //@IsInt({ message: "Должно быть целым числом" })
  @IsNotEmpty({ message: "Укажите количество жиров" })
  readonly fats: number;

  @ApiProperty({ example: 35, description: "Углеводы (г, целое число)" })
  //@IsInt({ message: "Должно быть целым числом" })
  @IsNotEmpty({ message: "Укажите количество углеводов" })
  readonly carbohydrates: number;

  @ApiProperty({ example: 999, description: "рубли" })
  // @IsNumber({}, { message: "Должно быть целым числом" })
  @IsNotEmpty({ message: "Укажите цену" })
  readonly price: number;

  // @ApiProperty({ example: 1, description: "ID пользователя" })
  //@IsInt({ message: "Должно быть целым числом" })
  // @IsNotEmpty({ message: "Не указан id пользователя" })
  // readonly userId: number;

  @ApiProperty({ example: "uuid", description: "файл" })
  readonly image: string;
}

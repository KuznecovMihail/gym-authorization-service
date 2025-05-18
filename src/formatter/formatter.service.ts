import { Injectable } from "@nestjs/common";
import { HealthyEatingDto } from "src/healthy-eating/dto/healthy-eating-dto";
import { MealNutrientsDto } from "src/healthy-eating/dto/meal-nutrients-dto";

export interface FormatMeal extends Partial<HealthyEatingDto> {
  calories?: number;
  nutrients?: MealNutrientsDto;
}
@Injectable()
export class FormatterService {
  formatMeal(data: HealthyEatingDto): FormatMeal {
    return {
      id: data.id,
      title: data.title,
      calories: data.kcal,
      compound: data.compound,
      image: `http://${process.env.POSTGRES_HOST}:${process.env.PORT}/${data.image}`,
      price: data.price,
      eatingType: data.eatingType,
      inBasketQuantity: data.inBasketQuantity,
      nutrients: {
        squirrels: data.squirrels,
        fats: data.fats,
        carbohydrates: data.carbohydrates,
      },
    };
  }
}

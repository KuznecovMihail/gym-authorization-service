import { Injectable } from "@nestjs/common";
import { HealthyEating } from "src/healthy-eating/healthy-eating.model";

@Injectable()
export class FormatterService {
  formatMeal({ dataValues }: HealthyEating) {
    return {
      id: dataValues.id,
      title: dataValues.title,
      calories: dataValues.kcal,
      compound: dataValues.compound,
      image: `http://${process.env.POSTGRES_HOST}:${process.env.PORT}/${dataValues.image}`,
      price: dataValues.price,
      eatingType: dataValues.eatingType,
      nutrients: {
        squirrels: dataValues.squirrels,
        fats: dataValues.fats,
        carbohydrates: dataValues.carbohydrates,
      },
    };
  }
}

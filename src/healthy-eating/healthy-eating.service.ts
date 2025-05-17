import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateHealthyEatingDto } from "./dto/create-healthy-eating.dto";
import { UpdateHealthyEatingDto } from "./dto/update-healthy-eating.dto";
import { InjectModel } from "@nestjs/sequelize";
import { HealthyEating } from "./healthy-eating.model";
import { FilesService } from "src/files/files.service";
import { UsersService } from "src/users/users.service";
import { EatingType } from "src/enum/EatingType";
import { JwtService } from "@nestjs/jwt";
import { BasketService } from "src/basket/basket.service";
import { AddToBasketDto } from "./dto/add-to-basket-dto";
import { FormatterService } from "src/formatter/formatter.service";
import { Op } from "sequelize";

interface MealPlan {
  breakfast: HealthyEating;
  lunch: HealthyEating;
  dinner: HealthyEating;
  totalCalories: number;
  totalSquirrels: number;
  totalFats: number;
  totalCarbohydrates: number;
}

@Injectable()
export class HealthyEatingService {
  constructor(
    @InjectModel(HealthyEating)
    private healthyEatingRepository: typeof HealthyEating,
    private filesService: FilesService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private basketService: BasketService,
    private formatter: FormatterService
  ) {}

  // private transformHyEatingData(data: HealthyEating | null) {
  //   if (!data) return;
  //   const { dataValues: item } = data;

  //   return {
  //     id: item.id,
  //     title: item.title,
  //     compound: item.compound,
  //     kcal: item.kcal,
  //     squirrels: item.squirrels,
  //     fats: item.fats,
  //     carbohydrates: item.carbohydrates,
  //     price: item.price,
  //     image: `http://${process.env.POSTGRES_HOST}:${process.env.PORT}/${item.image}`,
  //   };
  // }

  async create(
    createHealthyEatingDto: CreateHealthyEatingDto,
    image: any,
    headers: any
  ) {
    const { authorization } = headers;
    const token = authorization.replace("Bearer ", "");
    const payload = this.jwtService.decode(token);
    const fileName = await this.filesService.createFile(image);
    const user = await this.healthyEatingRepository.create({
      ...createHealthyEatingDto,
      userId: payload.id,
      image: fileName,
    });

    return user;
  }

  async findAll() {
    const healthyEating = await this.healthyEatingRepository.findAll({
      include: { all: true },
      order: [["id", "DESC"]],
    });

    const mappedData = healthyEating.map((el) => this.formatter.formatMeal(el));

    return mappedData;
  }

  async findOne(id: number) {
    const healthyEating = await this.healthyEatingRepository.findByPk(id);

    if (!healthyEating) {
      throw new HttpException(
        "Продукт с таким id не найден",
        HttpStatus.NOT_FOUND
      );
    }

    return this.formatter.formatMeal(healthyEating);
  }

  async update(id: number, updateDto: UpdateHealthyEatingDto, image: any) {
    const record = await this.healthyEatingRepository.findByPk(id);

    if (!record) {
      throw new NotFoundException(`Запись с id ${id} не найдена`);
    }
    const fileName = image
      ? await this.filesService.createFile(image)
      : undefined;
    await record.update({ ...updateDto, image: fileName });
  }

  async remove(id: number) {
    const healthyEating = await this.healthyEatingRepository.findByPk(id);

    if (!healthyEating)
      throw new NotFoundException(`Запись с id ${id} не найдена`);

    await healthyEating.destroy();
  }

  async getForUser(id: number) {
    const user = await this.usersService.getUsersById(id);
    if (!user) throw new NotFoundException(`Запись с id ${id} не найдена`);

    const kal = this.usersService.calculateKal(user);
    if (!kal)
      throw new HttpException(
        "Не заполнены обязательное поле",
        HttpStatus.BAD_REQUEST
      );
    return this.getMealPlan(1050);
  }

  async getMealPlan(dailyCalories: number, tolerancePercentage: number = 10) {
    const tolerance = dailyCalories * (tolerancePercentage / 100);
    const minCalories = dailyCalories - tolerance;
    const maxCalories = dailyCalories + tolerance;

    // Кешируем данные и предварительно фильтруем
    const [breakfasts, lunches, dinners] = await Promise.all([
      this.getFilteredMeals(EatingType.BREAKFAST, minCalories, maxCalories),
      this.getFilteredMeals(EatingType.LUNCH, minCalories, maxCalories),
      this.getFilteredMeals(EatingType.DINNER, minCalories, maxCalories),
    ]);

    // Ограничиваем количество вариантов для перебора
    const MAX_PER_TYPE = 20; // Не более 20 вариантов каждого типа
    const sampledBreakfasts = this.sampleArray(breakfasts, MAX_PER_TYPE);
    const sampledLunches = this.sampleArray(lunches, MAX_PER_TYPE);
    const sampledDinners = this.sampleArray(dinners, MAX_PER_TYPE);

    const results: MealPlan[] = [];

    // Перебор с ранним выходом
    for (const breakfast of sampledBreakfasts) {
      for (const lunch of sampledLunches) {
        const remainingCalories = maxCalories - breakfast.kcal - lunch.kcal;

        // Быстрый поиск подходящих ужинов
        const suitableDinners = sampledDinners.filter(
          (dinner) =>
            dinner.kcal >= remainingCalories - tolerance &&
            dinner.kcal <= remainingCalories + tolerance
        );

        for (const dinner of suitableDinners) {
          const totalCalories = breakfast.kcal + lunch.kcal + dinner.kcal;
          if (totalCalories >= minCalories && totalCalories <= maxCalories) {
            results.push({
              breakfast,
              lunch,
              dinner,
              totalCalories,
              totalSquirrels:
                breakfast.squirrels + lunch.squirrels + dinner.squirrels,
              totalFats: breakfast.fats + lunch.fats + dinner.fats,
              totalCarbohydrates:
                breakfast.carbohydrates +
                lunch.carbohydrates +
                dinner.carbohydrates,
            });

            // Ограничиваем количество результатов
            if (results.length >= 50) break;
          }
        }
        if (results.length >= 50) break;
      }
      if (results.length >= 50) break;
    }

    // Сортировка и форматирование
    return this.formatResults(results, dailyCalories);
  }

  private async getFilteredMeals(type: EatingType, min: number, max: number) {
    return this.healthyEatingRepository.findAll({
      where: {
        eatingType: type,
        kcal: {
          [Op.between]: [min * 0.3, max * 0.5],
        },
      },
      limit: 100,
    });
  }
  private sampleArray(arr: any[], max: number) {
    return arr.length > max
      ? arr.sort(() => 0.5 - Math.random()).slice(0, max)
      : arr;
  }

  private formatResults(combinations: MealPlan[], targetCalories: number) {
    return combinations
      .sort(
        (a, b) =>
          Math.abs(a.totalCalories - targetCalories) -
          Math.abs(b.totalCalories - targetCalories)
      )
      .slice(0, 10) // Возвращаем только 10 лучших вариантов
      .map((combination) => ({
        meals: {
          breakfast: this.formatter.formatMeal(combination.breakfast),
          lunch: this.formatter.formatMeal(combination.lunch),
          dinner: this.formatter.formatMeal(combination.dinner),
        },
        totals: {
          calories: combination.totalCalories,
          squirrels: combination.totalSquirrels,
          fats: combination.totalFats,
          carbohydrates: combination.totalCarbohydrates,
        },
      }));
  }
  async addMealIntoBasket({ itemId, quantity }: AddToBasketDto, headers: any) {
    const item = await this.healthyEatingRepository.findByPk(itemId);
    if (!item) {
      throw new NotFoundException("Продукт с таким id не найден");
    }
    const basket = await this.basketService.findOne(headers);
    if (!basket) {
      throw new NotFoundException("Корзина не найдена");
    }
    basket?.$add("items", itemId, { through: { quantity } });
  }
}

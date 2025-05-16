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
  private transformHyEatingData(data: HealthyEating | null) {
    if (!data) return;
    const { dataValues: item } = data;

    return {
      id: item.id,
      title: item.title,
      compound: item.compound,
      kcal: item.kcal,
      squirrels: item.squirrels,
      fats: item.fats,
      carbohydrates: item.carbohydrates,
      price: item.price,
      image: `http://${process.env.POSTGRES_HOST}:${process.env.PORT}/${item.image}`,
    };
  }

  constructor(
    @InjectModel(HealthyEating)
    private healthyEatingRepository: typeof HealthyEating,
    private filesService: FilesService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

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

    const mappedData = healthyEating.map((el) =>
      this.transformHyEatingData(el)
    );

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

    return this.transformHyEatingData(healthyEating);
  }

  async update(id: number, updateDto: UpdateHealthyEatingDto, image: any) {
    const record = await this.healthyEatingRepository.findByPk(id);

    if (!record) {
      throw new NotFoundException(`Запись с id ${id} не найдена`);
    }
    const fileName = await this.filesService.createFile(image);
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
    return this.getMealPlan(kal);
  }

  async getMealPlan(dailyCalories: number, tolerancePercentage: number = 10) {
    const tolerance = dailyCalories * (tolerancePercentage / 100);

    const minCalories = dailyCalories - tolerance;
    const maxCalories = dailyCalories + tolerance;

    const [breakfasts, lunches, dinners] = await Promise.all([
      this.getMealsByType(EatingType.BREAKFAST),
      this.getMealsByType(EatingType.LUNCH),
      this.getMealsByType(EatingType.DINNER),
    ]);

    const allCombinations: MealPlan[] = [];

    for (const breakfast of breakfasts) {
      for (const lunch of lunches) {
        for (const dinner of dinners) {
          const totalCalories =
            breakfast.dataValues.kcal +
            lunch.dataValues.kcal +
            dinner.dataValues.kcal;

          if (totalCalories >= minCalories && totalCalories <= maxCalories) {
            allCombinations.push({
              breakfast,
              lunch,
              dinner,
              totalCalories,
              totalSquirrels:
                breakfast.dataValues.squirrels +
                lunch.dataValues.squirrels +
                dinner.dataValues.squirrels,
              totalFats:
                breakfast.dataValues.fats +
                lunch.dataValues.fats +
                dinner.dataValues.fats,
              totalCarbohydrates:
                breakfast.dataValues.carbohydrates +
                lunch.dataValues.carbohydrates +
                dinner.dataValues.carbohydrates,
            });
          }
        }
      }
    }

    allCombinations.sort(
      (a, b) =>
        Math.abs(a.totalCalories - dailyCalories) -
        Math.abs(b.totalCalories - dailyCalories)
    );

    return allCombinations.map((combination) => ({
      meals: {
        breakfast: this.formatMeal(combination.breakfast),
        lunch: this.formatMeal(combination.lunch),
        dinner: this.formatMeal(combination.dinner),
      },
      totals: {
        calories: combination.totalCalories,
        squirrels: combination.totalSquirrels,
        fats: combination.totalFats,
        carbohydrates: combination.totalCarbohydrates,
      },
    }));
  }

  private async getMealsByType(type: EatingType) {
    const maels = await this.healthyEatingRepository.findAll({
      where: { eatingType: type },
    });

    return maels;
  }

  private formatMeal({ dataValues }: HealthyEating) {
    return {
      id: dataValues.id,
      title: dataValues.title,
      calories: dataValues.kcal,
      compound: dataValues.compound,
      image: `http://${process.env.POSTGRES_HOST}:${process.env.PORT}/${dataValues.image}`,
      price: dataValues.price,
      nutrients: {
        squirrels: dataValues.squirrels,
        fats: dataValues.fats,
        carbohydrates: dataValues.carbohydrates,
      },
    };
  }
}

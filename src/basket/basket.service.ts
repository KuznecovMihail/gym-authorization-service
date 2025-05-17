import { HealthyEatingService } from "./../healthy-eating/healthy-eating.service";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Basket } from "./basket.model";
import { BasketUser } from "./basket-user.model";
import { FormatterService } from "src/formatter/formatter.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket)
    private basketRepository: typeof Basket,
    @InjectModel(BasketUser)
    private basketUserRepository: typeof BasketUser,
    private formatter: FormatterService,
    private jwtService: JwtService
  ) {}
  async createBasket(userId: number) {
    try {
      (await this.getUserBaskets(userId)).forEach(
        async ({ dataValues: { baskeId } }) => {
          const basket = await this.basketRepository.findByPk(baskeId);
          basket?.update({ ...basket, isActive: false });
        }
      );
      console.log("is Active = false");
      const data = {
        userId,
        isActive: true,
        price: 0,
      };

      const basket = await this.basketRepository.create(data);
      console.log("create basket");
      await basket.$set("user", userId);
      console.log("set userId");

      return basket;
    } catch (e) {
      throw new HttpException(
        "Произошла ошибка при записи файла",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBaketItems(headers: any) {
    const basket = await this.findOne(headers);
    if (!basket) {
      throw new NotFoundException("basket не найден");
    }
    const mappedData = basket
      ? (await basket.$get("items")).map((el) => ({
          ...this.formatter.formatMeal(el),
          quantity: el["BasketItems"].dataValues.quantity,
        }))
      : [];

    return mappedData;
  }

  async deleteItem(itemId: number, headers: any) {
    const basket = await this.findOne(headers);
    if (!basket) {
      throw new NotFoundException("basket не найден");
    }
    const [item] = await basket.$get("items", { where: { id: itemId } });
    if (!item) {
      throw new NotFoundException("Продукта с таким id не найдено");
    }
    basket.$remove("items", itemId);
  }

  async findOne(headers: any) {
    const { authorization } = headers;
    const token = authorization.replace("Bearer ", "");
    const { id } = this.jwtService.decode(token);
    if (!id) {
      throw new NotFoundException("id не найден");
    }
    const [basket] = (await this.getUserBaskets(id)).map(
      async ({ dataValues: { baskeId } }) => {
        return await this.basketRepository.findOne({
          where: { id: baskeId, isActive: true },
        });
      }
    );

    return basket;
  }

  private async getUserBaskets(userId: number) {
    return await this.basketUserRepository.findAll({ where: { userId } });
  }
}

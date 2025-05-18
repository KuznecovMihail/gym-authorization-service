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
import { FormatMeal, FormatterService } from "src/formatter/formatter.service";
import { JwtService } from "@nestjs/jwt";
import { BasketItems } from "./basket-items.model";
import { HealthyEatingDto } from "src/healthy-eating/dto/healthy-eating-dto";

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket)
    private basketRepository: typeof Basket,
    @InjectModel(BasketUser)
    private basketUserRepository: typeof BasketUser,
    @InjectModel(BasketItems)
    private basketItemsRepository: typeof BasketItems,
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

  async changeQuantityItem(itemId: number, headers: any, type: "inc" | "dec") {
    const basket = await this.findOne(headers);
    if (!basket) {
      throw new NotFoundException("basket не найден");
    }
    const [item] = await basket.$get("items", { where: { id: itemId } });
    if (!item) {
      throw new NotFoundException("Продукта с таким id не найдено");
    }

    const currentQuantity = item["BasketItems"].dataValues.quantity;

    const calculateQuantity =
      type === "inc" ? currentQuantity + 1 : currentQuantity - 1;

    if (calculateQuantity <= 0) await basket.$remove("items", item);
    else {
      await this.basketItemsRepository.update(
        { quantity: calculateQuantity },
        {
          where: {
            baskeId: basket.id,
            itemId: item.id,
          },
        }
      );
      return calculateQuantity;
    }
  }

  async getAllQuantity(headers: any) {
    try {
      const basket = await this.findOne(headers);
      if (!basket) {
        throw new NotFoundException("basket 123123не найден");
      }
      const items = await basket.$get("items");
      const quantity = items.reduce(
        (acc, q) => acc + q["BasketItems"].dataValues.quantity,
        0
      );

      return quantity;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(headers: any) {
    const { authorization } = headers;
    const token = authorization.replace("Bearer ", "");
    const { id } = this.jwtService.decode(token);

    if (!id) {
      throw new NotFoundException("id не найден");
    }

    const userBaskets = await this.getUserBaskets(id);

    for (const {
      dataValues: { baskeId },
    } of userBaskets) {
      const basket = await this.basketRepository.findOne({
        where: { id: baskeId, isActive: true },
      });

      if (basket) return basket;
    }

    throw new NotFoundException("Активная корзина не найдена");
  }

  async orderHistory(headers: any) {
    const { authorization } = headers;
    const token = authorization.replace("Bearer ", "");
    const { id } = this.jwtService.decode(token);

    if (!id) {
      throw new NotFoundException("id не найден");
    }
    const userBaskets = (await this.getUserBaskets(id)).map(
      ({ dataValues }) => dataValues.baskeId
    );

    const baskets: { items: FormatMeal[]; id: number }[] = [];

    for (const id of userBaskets) {
      const item = await this.basketRepository.findOne({
        where: { id, isActive: false },
      });
      const mappedData = item
        ? (await item.$get("items")).map((el) => ({
            ...this.formatter.formatMeal(el),
            quantity: el["BasketItems"].dataValues.quantity,
          }))
        : [];
      item &&
        mappedData.length &&
        baskets.push({ items: mappedData, id: item?.dataValues.id });
    }

    return baskets;
  }

  private async getUserBaskets(userId: number) {
    return await this.basketUserRepository.findAll({
      where: { userId },
      order: [["id", "DESC"]],
    });
  }
}

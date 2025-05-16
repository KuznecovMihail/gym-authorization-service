import { HealthyEatingService } from "./../healthy-eating/healthy-eating.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Basket } from "./basket.model";
import { BasketUser } from "./basket-user.model";

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket)
    private basketRepository: typeof Basket,
    @InjectModel(BasketUser)
    private basketUserRepository: typeof BasketUser
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

  async getBaketItems(id: number) {
    const basket = await this.findOne(id);
    // const mappedData = basket
    //   ? (await basket?.$get("items")).map((el) =>
    //       this.healthyEatingService.formatMeal(el)
    //     )
    //   : [];
    return basket;
  }

  async findOne(userId: number) {
    const [basket] = (await this.getUserBaskets(userId)).map(
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

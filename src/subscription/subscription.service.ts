import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Subscription } from "./subscription.model";
import { Op } from "sequelize";
import { SetPriceDto } from "./dto/set-price.dto";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionRepository: typeof Subscription
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const item = await this.subscriptionRepository.findOne({
      where: {
        globalType: createSubscriptionDto.globalType,
        type: createSubscriptionDto.type,
      },
    });

    if (item)
      throw new BadRequestException(
        `Запись с globalType: ${createSubscriptionDto.globalType} и type: ${createSubscriptionDto.type} уже существует`
      );

    return await this.subscriptionRepository.create(createSubscriptionDto);
  }

  async findAll() {
    const items = await this.subscriptionRepository.findAll({
      order: [["type", "ASC"]],
    });
    return items;
  }

  async findOne(id: number) {
    const item = await this.subscriptionRepository.findByPk(id);
    if (!item) throw new NotFoundException("Записи с таким id не существует");
    return item;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    const item = await this.subscriptionRepository.findByPk(id);
    if (!item) throw new NotFoundException("Записи с таким id не существует");

    const findItem = await this.subscriptionRepository.findOne({
      where: {
        globalType: updateSubscriptionDto.globalType,
        type: updateSubscriptionDto.type,
        id: { [Op.ne]: id },
      },
    });

    if (findItem)
      throw new BadRequestException(
        `Запись с globalType: ${updateSubscriptionDto.globalType} и type: ${updateSubscriptionDto.type} уже существует`
      );

    item.update(updateSubscriptionDto);
  }

  async remove(id: number) {
    const item = await this.subscriptionRepository.findByPk(id);
    if (!item) throw new NotFoundException("Записи с таким id не существует");
    await item.destroy();
  }

  async setPrice({ type, trainerPrice }: SetPriceDto) {
    try {
      const [updatedCount] = await this.subscriptionRepository.update(
        { trainerPrice },
        { where: { type } }
      );
      if (updatedCount === 0)
        throw new NotFoundException(`Записей с type: ${type} не существует`);
    } catch (e) {
      console.log("e", e);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}

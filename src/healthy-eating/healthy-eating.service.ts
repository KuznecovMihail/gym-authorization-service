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
      image: item.image,
    };
  }

  constructor(
    @InjectModel(HealthyEating)
    private healthyEatingRepository: typeof HealthyEating,
    private filesService: FilesService
  ) {}

  async create(createHealthyEatingDto: CreateHealthyEatingDto, image: any) {
    const fileName = await this.filesService.createFile(image);
    const user = await this.healthyEatingRepository.create({
      ...createHealthyEatingDto,
      image: fileName,
    });

    return user;
  }

  async findAll() {
    const healthyEating = await this.healthyEatingRepository.findAll({
      include: { all: true },
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

  async update(id: number, updateDto: UpdateHealthyEatingDto) {
    const record = await this.healthyEatingRepository.findByPk(id);

    if (!record) {
      throw new NotFoundException(`Запись с id ${id} не найдена`);
    }
    await record.update(updateDto);
  }

  async remove(id: number) {
    const healthyEating = await this.healthyEatingRepository.findByPk(id);

    if (!healthyEating) {
      throw new NotFoundException(`Запись с id ${id} не найдена`);
    }

    await healthyEating.destroy();
  }
}

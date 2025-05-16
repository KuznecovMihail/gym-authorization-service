import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { BasketItems } from "src/basket/basket-items.model";
import { Basket } from "src/basket/basket.model";
import { EatingType } from "src/enum/EatingType";
import { User } from "src/users/user.model";

interface HealthyEatingAttribute {
  title: string;
  compound: string;
  userId: number;
  image: string;
  kcal: number;
  squirrels: number;
  fats: number;
  carbohydrates: number;
  price: number;
}

@Table({ tableName: "healthyEating" })
export class HealthyEating extends Model<
  HealthyEating,
  HealthyEatingAttribute
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  declare title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare compound: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare kcal: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare squirrels: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare fats: number;

  @Column({ type: DataType.INTEGER })
  declare carbohydrates: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  declare price: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare image: string;

  @Column({
    type: DataType.ENUM(...Object.values(EatingType)),
    allowNull: true,
  })
  declare eatingType: EatingType;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare userId: number;

  @BelongsTo(() => User)
  declare author: User;

  @BelongsToMany(() => Basket, () => BasketItems)
  declare basket: Basket[];
}

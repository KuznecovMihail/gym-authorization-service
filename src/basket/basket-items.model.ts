import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { HealthyEating } from "src/healthy-eating/healthy-eating.model";
import { Role } from "src/roles/roles.model";
import { User } from "src/users/user.model";
import { Basket } from "./basket.model";

interface BasketItemsCreationAttribute {
  itemId: number;
  baskeId: number;
  quantity: number;
}

@Table({ tableName: "basketItems", createdAt: false, updatedAt: false })
export class BasketItems extends Model<
  BasketItems,
  BasketItemsCreationAttribute
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => HealthyEating)
  @Column({ type: DataType.INTEGER })
  declare itemId: number;

  @ForeignKey(() => Basket)
  @Column({ type: DataType.INTEGER })
  declare baskeId: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  })
  quantity: number;
}

import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "src/users/user.model";
import { Basket } from "./basket.model";

interface BasketUserCreationAttribute {
  baskeId: number;
  userId: number;
}

@Table({ tableName: "basketUser", createdAt: false, updatedAt: false })
export class BasketUser extends Model<BasketUser, BasketUserCreationAttribute> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare userId: number;

  @ForeignKey(() => Basket)
  @Column({ type: DataType.INTEGER })
  declare baskeId: number;
}

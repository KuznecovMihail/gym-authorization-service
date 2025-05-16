import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Max, Min } from "class-validator";
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Sex } from "src/enum/Sex";
import { HealthyEating } from "src/healthy-eating/healthy-eating.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/user-role/user-role-model";
import { BasketItems } from "./basket-items.model";
import { User } from "src/users/user.model";
import { BasketUser } from "./basket-user.model";

interface BasketCreationAttribute {
  isActive: boolean;
  price: number;
  userId: number;
}

@Table({ tableName: "basket" })
export class Basket extends Model<Basket, BasketCreationAttribute> {
  @ApiProperty({ example: 1, description: "ID" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: false, description: "Активна ли корзина" })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isActive: boolean;

  @ApiProperty({ example: "999", description: "Сумма items" })
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  @ApiProperty({ example: "items", description: "items" })
  @BelongsToMany(() => HealthyEating, () => BasketItems)
  items: HealthyEating[];

  @ApiProperty({ example: "user", description: "user" })
  @BelongsToMany(() => User, () => BasketUser)
  user: User[];
}

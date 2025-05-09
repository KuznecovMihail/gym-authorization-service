import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
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
  title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  compound: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  kcal: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  squirrels: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  fats: number;

  @Column({ type: DataType.INTEGER })
  carbohydrates: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  price: number;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  author: User;
}

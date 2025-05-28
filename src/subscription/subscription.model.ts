import { Table, Column, Model, DataType } from "sequelize-typescript";

interface SubscriptionCreationAttribute {
  globalType: string;
  type: string;
  timeStart: string;
  timeEnd: string;
  price: number;
}

@Table({ tableName: "subscription", createdAt: false, updatedAt: false })
export class Subscription extends Model<
  Subscription,
  SubscriptionCreationAttribute
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING })
  declare globalType: string;

  @Column({ type: DataType.STRING })
  declare type: string;

  @Column({ type: DataType.STRING })
  declare timeStart: string;

  @Column({ type: DataType.STRING })
  declare timeEnd: string;

  @Column({ type: DataType.INTEGER })
  declare price: number;

  @Column({ type: DataType.INTEGER })
  declare trainerPrice: number;
}

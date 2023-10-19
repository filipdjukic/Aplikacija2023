import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import * as Validator from 'class-validator';

@Index("uq_administrator_username", ["username"], { unique: true })
@Entity("administrator") //nije neophodno zbog konvencije imenovanja
export class Administrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "administrator_id",
    unsigned: true,
  })
  administratorId: number;

  @Column("varchar", {
    //name: "username", ne mora jer se isto zove i u bazi i u entity
    unique: true,
    length: 32
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{3,30}[a-z0-9]$/)
  username: string;

  @Column({
    type: "varchar",
    name: "password_hash",
    length: 128,
  })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;
}
//model=entity
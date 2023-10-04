/*import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Administrator {
    @PrimaryGeneratedColumn({ name: 'administrator_id', type: 'int', unsigned: true })
    administratorId: number;

    @Column({ type: 'varchar', length: '32', unique: true})
    username: string;

    @Column({ name: 'password_hash', type: 'varchar', length: '128' })
    passwordHash: string;
}*/

import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

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
  username: string;

  @Column({
    type: "varchar",
    name: "password_hash",
    length: 128,
  })
  passwordHash: string;
}
//model=entity
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, DeleteDateColumn } from 'typeorm';
import { Roles } from '../../roles/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @ManyToMany(() => Roles, { eager: true })
  @JoinTable({
    name: 'users_roles', // nombre de la tabla intermedia
    joinColumn: {
      name: 'userId', // columna que referencia la entidad User
      referencedColumnName: 'userId',
    },
    inverseJoinColumn: {
      name: 'roleId', // columna que referencia la entidad Roles
      referencedColumnName: 'roleId',
    },
  })
  roles: Roles[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}


import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, DeleteDateColumn, OneToMany } from 'typeorm';
import { Roles } from '../../roles/entities/role.entity';
import { Company } from '../../../modules/company/entities/company.entity';
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

   // Nuevo campo para almacenar la fecha de expiración del código (opcional)
   @Column({ nullable: true })
   resetCodeExpiry: Date | null;

  // Nuevo campo para almacenar el código de recuperación temporalmente
  @Column({ nullable: true })
  resetCode: string | null;

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

    // Relación OneToMany con la entidad Company
    @OneToMany(() => Company, (company) => company.owner)
    companies: Company[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}


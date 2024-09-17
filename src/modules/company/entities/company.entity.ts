import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  banner?: string;

  @Column()
  type: string; 

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  // Relación ManyToOne con la entidad User
  @ManyToOne(() => User, (user) => user.companies, { nullable: false })
  owner: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  // @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;

  // @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  // updatedAt: Date;

  // @DeleteDateColumn({ name: 'deletedAt' })
  // deletedAt: Date;
}


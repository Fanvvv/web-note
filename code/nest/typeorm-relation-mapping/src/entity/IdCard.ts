import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import {User} from "./User"

@Entity({
    name: 'id_card'
})
export class IdCard {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50,
        comment: '身份证号'
    })
    cardName: string

    /**
     * JoinColumn() 显式定义关系中的外键列 默认情况下，TypeORM 会根据实体名称（表名）和关系名（字段名）自动生成外键列的名称。
     * JoinColumn({ name: 'user_id' }) 自定义外键列的名称
     * OneToOne 表示一对一关系
     * cascade: true 表示级联操作
     * onDelete: 'CASCADE' 表示级联删除
     * onUpdate: 'CASCADE' 表示级联更新
     */
    @JoinColumn()
    @OneToOne(() => User, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    user: User
}

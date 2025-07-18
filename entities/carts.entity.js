const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'carts', // 實體的名稱
  tableName: 'carts', // 對應的資料表名稱
  columns: {
        id: {
        primary: true, // 設定為主鍵
        type: 'uuid', // 資料型別為 UUID
        generated: 'uuid', // 設定為 UUID 自動生成
        },
        user_id: {
            type: 'uuid',
            nullable: false,
        },
        created_at: {
            type: 'timestamptz',
            createDate: true,
            default: () => 'CURRENT_TIMESTAMP'
        },
        updated_at: {
            type: 'timestamptz',
            updateDate: true,
            default: () => 'CURRENT_TIMESTAMP'
        }
    },
    relations: {
        users: {
            target: 'users',
            type: 'many-to-one',
            inverseSide: 'carts',
            joinColumn: {
                name: 'user_id',
                referencedColumnName: 'id',
                foreignKeyConstraintName: 'carts_users_id_fk'
            }
        }
    }
})

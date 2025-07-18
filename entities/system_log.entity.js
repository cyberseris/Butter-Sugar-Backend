const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'system_log',
    tableName: 'system_log',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        user_id: {
            type: 'uuid',
            nullable: true,
        },
        role: {
            type: 'varchar',
            length: 50,
            nullable: true,
        },
        action: {
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        api: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        sys_module: { 
            type: 'varchar',
            length: 50,
            nullable: true,
        },
        email: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        ip: {
            type: 'varchar',
            length: 45, 
            default: '秘密'
        },
        status: {
            type: 'varchar',   //varchar: 可自定義狀態, ex: 200_ok,  int: 200
            length: 20,
            nullable: true,
        },
        user_agent: {
            type: 'varchar',
            length: 500,
            nullable: true,
        },
        created_at: {
            type: 'timestamptz',
            createDate: true,
            default: () => 'CURRENT_TIMESTAMP'
        },
    },
    relations: {
        user: {
            target: 'users',
            type: 'many-to-one',
            joinColumn: {
                name: 'user_id',
                referencedColumnName: 'id',
                foreignKeyConstraintName: 'system_log_users_id_fk',
            },
            onDelete: 'SET NULL',
        },
    },
});

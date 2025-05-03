const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: 'Teacher',
    tableName: 'TEACHER',
    columns:{
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
            nullable: false
        },
        user_id: {
            type: 'uuid',
            nullable: false,
            unique: true
        },
        banner_image_url: {
            type: 'varchar',
            length: 255,
            nullable: true
        },
        rating_score: {
            type: 'numeric',
            precision: 10,
            scale: 2,
            nullable: true
        },
        slogan: {
            type: 'varchar',
            length: 255,
            nullable: true
        },
        bank_name: {
            type: 'varchar',
            length: 50,
            nullable: false
        },
        bank_account: {
            type: 'varchar',
            length: 50,
            nullable: false
        },
        description: {
            type: 'text',
            nullable: false
        },
        specialization: {
            type: 'text',
            nullable: false
        },
        created_at: {
            type: 'timestamp',
            createDate: true,
            nullable: false
        },
        updated_at: {
            type: 'timestamp',
            updateDate: true,
            nullable:false
        }
    },
    relations: {
        User: {
            target: 'User',
            type: 'one-to-one',
            inverseSide: 'Teacher',
            joinColumn:{
                name: 'user_id', //Teacher table
                referencedColumnName: 'id', //User table
                foreignKeyConstraintName: 'teacher_user_id_fk'
            }
        }
    }
})
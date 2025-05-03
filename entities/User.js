const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'USER',
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
            nullable: false
        },
        google_id: {
            type: 'varchar',
            length: 100,
            nullable: false,
            unique: true
        },
        name: {
            type: 'varchar',
            length: 50,
            nullable: false
        },
        nickname: {
            type: 'varchar',
            length: 100,
            nullable: false
        },
        role: {
            type: 'varchar',
            length: 20,
            nullable: false
        },
        email: {
            type: 'varchar',
            length: 100,
            nullable: false,
            unique: true
        },
        phone: {
            type: 'varchar',
            length: 20,
            nullable: true
        },
        birthday:{
            type: 'date', // YYYY-MM-DD
            nullable: true
        },
        sex: {
            type: 'varchar',
            length: 10,
            nullable: true    
        },
        address: {
            type: 'text',
            nullable: true
        },
        is_active: {
            type: 'boolean',
            default: true,
            nullable: false
        },
        is_verified: {
            type: 'boolean',
            nullable: false
        },
        login_count: {
            type: 'integer',
            default: 0
        },
        profile_image_url: {
            type: 'varchar',
            length: 255,
            nullable: true
        },
        google_token: {
            type: 'varchar',
            length: 255,
            nullable: false
        },
        last_login: {
            type: 'timestamp',
            nullable: false
        },
        created_at: {
            type: 'timestamp',
            nullable: false,
            createDate: true
        },
        updated_at: {
            type: 'timestamp',
            nullable: false,
            updateDate: true
        }
    }
})
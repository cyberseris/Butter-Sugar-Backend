const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'teacher',
  tableName: 'teacher',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid', 
    },
    user_id: {
      type: 'uuid',
      unique: true,
    },
    banner_image_url: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    rating_score: {
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: true,
    },
    slogan: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    bank_name: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    bank_account: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    //是否審核通過
    is_verified: {
      type: 'boolean',
      default: false,
    },
    specialization: {
      type: 'text',
      nullable: true,
    },
    created_at: {
      type: 'timestamptz',
      createDate: true,
    },
    updated_at: {
      type: 'timestamptz',
      updateDate: true,
    },
  },
  relations: {
    user: {
      target: 'users',
      type: 'one-to-one',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'teacher_users_id_fk',
      },
      onDelete: 'CASCADE',
    },
    course: {
        target: 'courses',
        type: 'one-to-many',
        inverseSide: 'teacher'
      }
  },
})

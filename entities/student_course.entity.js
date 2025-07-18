const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'student_course',
    tableName: 'student_course',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        user_id: {
            type: 'uuid',
            nullable: false
        },
        course_id: {
            type: 'uuid',
            nullable: false
        },
        last_subsection_id: {
            type: 'uuid',
            nullable: true  
        },
        completion_percentage: {
            type: 'numeric',
            precision: 10,
            scale: 2,
            nullable:true
        },
        purchase_date: {
            type: 'timestamptz',
            createDate: true,
        },
        last_accessed_at: {
            type: 'timestamptz',
            nullable: true,
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
        user: {
            type: 'many-to-one',
            target: 'users',
            joinColumn: { name: 'user_id' },
            onDelete: 'CASCADE'
        },
        course: {
            type: 'many-to-one', 
            target: 'courses',
            joinColumn: { name: 'course_id' },
            onDelete: 'CASCADE' 
        }
    },
});

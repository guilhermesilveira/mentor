class CreatePupilCourses < ActiveRecord::Migration
  def change
    create_table :pupil_courses do |t|
      t.string :name
      t.timestamp :startedAt
      t.timestamp :finishedAt
      t.timestamp :lastStudiedAt
      t.boolean :hadAHardTime, default: false
      t.integer :user_id, index:true
      t.integer :mentor_id, index: true
      t.integer :time_limit

      t.timestamps null: false
    end
    add_foreign_key :pupil_courses, :users, column: :user_id
    add_foreign_key :pupil_courses, :users, column: :mentor_id
  end
end

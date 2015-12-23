class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.integer :mentor_id, index: true
	    t.string :encrypted_password 
	    t.string :salt
      t.string :api_key

      t.timestamps null: false
    end
    add_foreign_key :users, :users, column: :mentor_id
  end
end

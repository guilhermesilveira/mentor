class CreateNoInvitations < ActiveRecord::Migration
  def change
    create_table :no_invitations do |t|
      t.string :email

      t.timestamps null: false
    end
  end
end

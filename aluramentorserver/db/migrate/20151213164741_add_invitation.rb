class AddInvitation < ActiveRecord::Migration
  def change
  	add_column :users, :accepted_invitation, :boolean, default: false
  end
end

class AddMentor < ActiveRecord::Migration
  def change
  	add_column :users, :isMentor, :boolean, default: false
  end
end

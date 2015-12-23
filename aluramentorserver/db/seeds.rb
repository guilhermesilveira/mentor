# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).

u = User.create name: "Guilherme Silveira", email: "guilherme.silveira@caelum.com.br", mentor_id: 1, isMentor: true
PupilCourse.create :name => "Java", :mentor_id => 1, :user => User.find(1), time_limit: 5

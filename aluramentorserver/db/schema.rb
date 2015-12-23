# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151217204607) do

  create_table "no_invitations", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "pupil_courses", force: :cascade do |t|
    t.string   "name"
    t.datetime "startedAt"
    t.datetime "finishedAt"
    t.datetime "lastStudiedAt"
    t.boolean  "hadAHardTime",  default: false
    t.integer  "user_id"
    t.integer  "mentor_id"
    t.integer  "time_limit"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "pupil_courses", ["mentor_id"], name: "index_pupil_courses_on_mentor_id"
  add_index "pupil_courses", ["user_id"], name: "index_pupil_courses_on_user_id"

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.integer  "mentor_id"
    t.string   "encrypted_password"
    t.string   "salt"
    t.string   "api_key"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.boolean  "isMentor",            default: false
    t.boolean  "accepted_invitation", default: false
  end

  add_index "users", ["mentor_id"], name: "index_users_on_mentor_id"

end

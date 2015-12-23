require 'digest/md5'

class User < ActiveRecord::Base
	belongs_to :mentor, class_name: :User
	has_many :pupils, class_name: User, foreign_key: :mentor_id
	has_many :pupilCourses

	def current_course
		pupilCourses.last
	end

	def status
		if !accepted_invitation
			'ainda não se cadastrou'
		elsif current_course.startedAt.nil?
			'não começou o curso'
		elsif current_course.finishedAt
			'finalizou o curso'
		else
			current_course.time_missing
		end
	end

	def gravatar
		md5 = Digest::MD5.hexdigest(email.strip.downcase)
		"http://www.gravatar.com/avatar/#{md5}.jpg?s=80&d=mm"
	end

	def encrypt_password(password)
	    self.accepted_invitation = true
	    self.salt = BCrypt::Engine.generate_salt
	    self.encrypted_password= encode(password)
	    regenerate_key
	end

	def regenerate_key
		salt = BCrypt::Engine.generate_salt
		self.api_key = "#{id}__#{salt}"
	end

	def match_password(login_password)
		return false if salt.nil?
		encrypted_password == encode(login_password)
	end

	def self.by_api(api_key)
		User.where(api_key: api_key).first
	end

private
	def encode(p)
		BCrypt::Engine.hash_secret(p, salt)
	end
end

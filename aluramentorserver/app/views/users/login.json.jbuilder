json.(@user, :id, :name, :isMentor, :gravatar, :api_key)
json.partial! 'pupil_course/show', course: @user.current_course
json.mentor do
	json.(@user.mentor, :id, :name, :gravatar, :email)
end
json.pupils @user.pupils do |pupil|
	json.user do
		json.(pupil, :id, :name, :gravatar)
	end
	json.partial! 'pupil_course/show', course: pupil.current_course
	json.status pupil.status
end
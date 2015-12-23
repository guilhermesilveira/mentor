class UsersController < ApplicationController

  skip_before_action :verify_authenticity_token

  # curl -v -H "Accept: application/json" -X GET "http://localhost:3000/users/login?email=guilherme.silveira@caelum.com.br&password=gui"
  def login
    email = params[:email].downcase
    pass = params[:password]
    @user = User.where(email: email).first
    if @user.nil?
      NoInvitation.create(email: email)
      render json: {message: "Você ainda não foi convidado. Peça para alguém mentorá-lo."}, status: 400
    elsif @user.match_password(pass)
      # ok
      @user.regenerate_key
      @user.save
    elsif !@user.accepted_invitation
      @user.encrypt_password pass
      @user.save
      # ok
    else
      render json: {message: "Email ou senha inválido."}, status: 400
    end

  end

  # curl -v -d '{"user" : {"name": "Pupilo Silveira", "email": "pupilo@gmail.com"}, "course" : {"name" : "C#", "time_limit" : 4}}' -H "Content-type: application/json" http://localhost:3000/inviteUser
  def invite
  	input = params[:data]
  	data = JSON.parse input
    exists = User.exists?(email: data["user"]["email"])

    if exists
      render json: { error: "Pupilo já foi convidado por algum mentor."}, status: 400
      return
    end

    @from = User.by_api(params[:api_key])

  	data["user"]["mentor"] = @from
  	@user = User.create data["user"]

  	course = data["course"]
  	data["course"]["mentor_id"] = @from.id
  	data["course"]["user"] = @user
  	@course = PupilCourse.create course
  	UserMailer.invite(@from, @user).deliver_later

  	render json: "{}"
  end

  def started
  	@user = User.by_api(params[:api_key])
  	course = @user.current_course
  	course.start
  	course.save
  	render "users/login"
  end
  def finished
    @user = User.by_api(params[:api_key])
  	course = @user.current_course
  	course.finish
  	course.save
    render "users/login"
  end
  def studied
    @user = User.by_api(params[:api_key])
  	course = @user.current_course
  	course.study
  	course.save
    render "users/login"
  end

  # curl -d "" -v http://localhost:3000/users/1/havingAHardTime
  def havingAHardTime
    @user = User.by_api(params[:api_key])
  	course = @user.current_course
  	course.having_a_hard_time
  	course.save
    render "users/login"
  end

end

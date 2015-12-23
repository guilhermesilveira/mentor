Rails.application.routes.draw do
  get 'users/login' => 'users#login'
  get 'inviteUser' => 'users#invite'
  get 'users/started' => 'users#started'
  get 'users/finished' => 'users#finished'
  get 'users/studied' => 'users#studied'
  get 'users/havingAHardTime' => 'users#havingAHardTime'
end

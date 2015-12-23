class UserMailer < ApplicationMailer
	def invite(from, to)
		@to = to
		@from = from
		from_string = "#{from.name} <contato@alura.com.br>"
		mail(to: @to.email, from: from_string,subject: "Quero ser seu mentor")
	end
end

include ActionView::Helpers::DateHelper

class PupilCourse < ActiveRecord::Base
  belongs_to :user

  def startedAtDate
    return nil if startedAt.nil?
    return time_ago_in_words startedAt
  end

  def finishedAtDate
    return nil if finishedAt.nil?
    return time_ago_in_words finishedAt
  end

  def lastStudiedAtDate
    return nil if lastStudiedAt.nil?
    return time_ago_in_words lastStudiedAt
  end

  def start
  	self.startedAt ||= DateTime.now
  end
  def finish
  	self.finishedAt ||= DateTime.now
  end
  def study
  	self.lastStudiedAt = DateTime.now
  end
  def having_a_hard_time
  	self.hadAHardTime = true
  end

  def time_missing
    diferenca = ((self.created_at + time_limit.weeks) - DateTime.now)
    dias = (diferenca / 1.days).floor
    horas = diferenca / 1.hour
    
    if dias > 1
      "faltam #{dias} dias"
    elsif dias == 1
      "falta 1 dia"
    elsif horas.floor == 1
      "falta 1 hora"
    elsif horas < 0
      "tempo esperado estourado... :( vamos correr atrás?"
    elsif horas < 1
      "falta menos de 1 hora"
    else
      "faltam #{horas.floor} horas"
    end
  end
end

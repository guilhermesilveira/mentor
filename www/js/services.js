// var loginUri = 'https://gist.githubusercontent.com/guilhermesilveira/8dbb8f4c72fa56551c90/raw/b942943c3511bfccdb7829ba40b88e6a4872ac73/login.json';
// var inviteUri = 'https://gist.githubusercontent.com/guilhermesilveira/8dbb8f4c72fa56551c90/raw/2b9bd7871b6cfc4aa7b63727cff73279bed1e978/invitation.json';

var loginUri = 'http://192.168.85.151:3000/users/login';
var inviteUri = 'http://localhost:3000/inviteUser';
var talkUri = 'http://localhost:3000/users/';

angular.module('starter.services', ['ionic'])

.service('AluraMentorAlarm', function($cordovaLocalNotification, $ionicPlatform) {
    var STUDY_CODE = 1;
    var MENTOR_CODE = 2;
    return {
        setupAlarm: function(studyTime, mentorTime, mentor) {
            console.log("setting up the alarm at " + $cordovaLocalNotification);

            if(studyTime == null) studyTime = 19;
            $cordovaLocalNotification.clearAll();
            var _nextAlarm = new Date();
            _nextAlarm.setHours(studyTime, 0, 0, 0);
            console.log("Setting next study alarm to " + _nextAlarm);
            $cordovaLocalNotification.schedule({
                id: STUDY_CODE,
                at: _nextAlarm,
                text: "Seu mentor",
                title: "Conforme combinou com " + mentor + ", hora de estudar!",
                every: "day"
            }).then(function () {
                console.log("The notification has been set");
            });

            if(mentorTime == null) mentorTime = 18;
            _nextAlarm = new Date();
            _nextAlarm.setHours(mentorTime, 0, 0, 0);
            console.log("Setting next mentor alarm to " + _nextAlarm);
            $cordovaLocalNotification.schedule({
                id: MENTOR_CODE,
                at: _nextAlarm,
                text: "Hora de ajudar",
                title: "Hora de ligar pros seus pupilos para saber como estão os estudos!",
                every: "day"
            }).then(function () {
                console.log("The notification has been set");
            });
        }
    };
})

.service('LoginService', function($q, $http) {
    return {
        loginUser: function(email, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({method: 'GET',
                    url: loginUri,
                    params : {
                        email: email,
                        password: pw
                    },
                    headers: {
                        'Accept': 'application/json'
                    }
                    })
                .then(function(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function(response) {
                    console.log(email + " invalid login: " + JSON.stringify(response));
                    deferred.reject(response);
                });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.service('InviteService', function($q, $http, $localstorage) {
    return {
        invite: function(data) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http.get(inviteUri,
                        {params:
                            {
                                data : data,
                                api_key : $localstorage.api_key()
                            },
                        })
                .then(function(response) {
                    var data = response.data;
                    deferred.resolve(data);
                }, function(response) {
                    if(response.status==400) {
                        deferred.reject(response.data.error)
                    } else {
                        deferred.reject("Impossível convidar, algum erro ocorreu.")
                    }
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})


.service('TalkService', function($q, $http, $localstorage) {
    return {
        talk: function(situation) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            $http.get(talkUri + situation,
                {
                    params: {
                        api_key : $localstorage.api_key()
                    },
                    headers: {
                        "Content-Type" : "application/x-www-form-urlencoded",
                        'Accept': 'application/json'
                    }
                })

                .then(function(response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    console.log(JSON.stringify(response));
                    deferred.reject('Impossible to talk.');
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },


    logout: function() {
        this.setObject('aluramentor.user', null);
    },
    login: function(user) {
        this.setObject('aluramentor.user', user);
        this.saveSettings({
            notificationSound: true,
            notificationVibrate: true,
            mentorTime: 18,
            studyTime: 19
        });
    },
    api_key: function() {
        return this.user()["api_key"];
    },
    user: function() {
        return this.getObject('aluramentor.user');
    },
    settings : function() {
        return this.getObject('aluramentor.settings') || {};
    },
    saveSettings : function(settings) {
        this.setObject('aluramentor.settings', settings);
    },
    isLoggedIn : function() {
        return this.user() != undefined && this.user() != null;
    }
  }
}])

.factory('Chats', function($localstorage) {
  var chats = $localstorage.user().pupils;

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }

  };
});

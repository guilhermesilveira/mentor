angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $localstorage, $ionicPlatform) {

    $ionicPlatform.ready(function() {
        if(ionic.Platform.device().isIOS) {
            window.plugin.notification.local.promptForPermission();
        }
    });

    console.log("current user: " + JSON.stringify($localstorage.user()));

    if($localstorage.isLoggedIn()) {
      $state.go('tab.student');
      return;
    }

    $scope.data = {};
 
    $scope.login = function() {
        console.log("trying to login");
        LoginService.loginUser($scope.data.email, $scope.data.password).success(function(user) {
            $localstorage.login(user);
            $state.go('tab.student');
            console.log('Got back ' + $localstorage.user().name);
        }).error(function(data) {
          var msg = "Erro ao tentar se logar.";
          if(data && data.data && data.data.message) {
            msg = data.data.message;
          } else {
            console.log(JSON.stringify(data));
          }
            var alertPopup = $ionicPopup.alert({
                title: 'Tentei mas não consegui :(',
                template: msg
            });
        });
    };
})

.controller('NewPupilCtrl', function($scope, InviteService, $ionicPopup, $state) {
  $scope.resetData = function() {
    $scope.data = { timeLimit : 5 };
  };
  $scope.resetData();
  $scope.invite = function(data) {
    var content = {
      user : {
        name : data.name,
        email : data.email
      },
      course : {
        name : data.course,
        time_limit : data.timeLimit
      }
    };
      InviteService.invite(content).success(function(data) {
          var alertPopup = $ionicPopup.alert({
              title: 'Convidei ' + data.name + '!',
              template: 'Win'
          });
          $scope.resetData();
          $state.go('tab.chats');
      }).error(function(msg) {
          var alertPopup = $ionicPopup.alert({
              title: 'Não consegui convidar!',
              template: msg
          });
      });
  };
})

.controller('ChatsCtrl', function($scope, Chats) {

  // TODO2: refresh
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.brokeChatLimit = function() {
    return Chats.all().length >= 5;
  };
  $scope.doRefresh = function() {
    $http.get('/new-items')
     .success(function(newItems) {
       $scope.items = newItems;
       console.log("reloaded");
     })
     .finally(function() {
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
})

.controller('StudentCtrl', function($scope, $localstorage, TalkService, $ionicPopup, $state, $window, $ionicPlatform, $window, AluraMentorAlarm) {
    $ionicPlatform.ready(function() {
          if ($window.cordova &&
              $window.cordova.plugins &&
              $window.cordova.plugins.notification.local.schedule) {
                  AluraMentorAlarm.setupAlarm($localstorage.settings().studyTime);
          }
    });

  $scope.user = $localstorage.user();
  $scope.settings = $localstorage.settings();

  $scope.talk = function(situation) {
      TalkService.talk(situation).success(function(user) {
          console.log(JSON.stringify(user));
          $localstorage.login(user);
          $window.location.reload(true)
      }).error(function(data) {
          var alertPopup = $ionicPopup.alert({
              title: 'Erro!',
              template: 'Não conseguimos avisar ' + $localstorage.user().mentor.name + '.'
          });
      });
  };
})

.controller('AccountCtrl', function($scope, $localstorage, $state, AluraMentorAlarm) {
  $scope.settings = $localstorage.settings();
  $scope.$watch('settings.notificationSound', function(newValue, oldValue) {
    $localstorage.saveSettings($scope.settings);
  });
  $scope.$watch('settings.notificationVibrate', function(newValue, oldValue) {
    $localstorage.saveSettings($scope.settings);
  });
  $scope.$watch('settings.studyTime', function(newValue, oldValue) {
    $localstorage.saveSettings($scope.settings);
    AluraMentorAlarm.setupAlarm($scope.settings.studyTime, $scope.settings.mentorTime);
  });
  $scope.$watch('settings.mentorTime', function(newValue, oldValue) {
    $localstorage.saveSettings($scope.settings);
    AluraMentorAlarm.setupAlarm($scope.settings.studyTime, $scope.settings.mentorTime);
  });

  $scope.logout = function() {
    console.log("logging out");
    $localstorage.logout();
    $state.go('login');
  };
});

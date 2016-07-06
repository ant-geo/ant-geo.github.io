var app = angular.module('app', ['mongolab']);

app.controller('homeCtrl', ['$scope', '$location', 'Task', 'filterFilter', function($scope, $location, Task, filterFilter) {

 $scope.tasks = Task.query();

  var interval = setInterval(function() {
    if ($scope.tasks[0]) {
      clearInterval(interval);
      initPlacemark();
    } else {
      $scope.tasks = Task.query();
    }
  }, 500);

  $scope.addPlacemarkCheck = {
    check: false
  };

  $scope.addPlacemarkCheckFunc = function () {
    if ($scope.addPlacemarkCheck.check) {
      $scope.addPlacemarkCheck.check = false;
      document.getElementsByClassName("ymaps-layers-pane")[0].style.webkitFilter = "grayscale(0%)";
      myMap.balloon.close();
    } else {
      $scope.addPlacemarkCheck.check = true;
      document.getElementsByClassName("ymaps-layers-pane")[0].style.webkitFilter = "grayscale(100%)";
    }
  };

  $scope.sender = {
    coordinateX: '',
    coordinateY: ''
  };

  $scope.searchArr = [];

  $scope.searchInit = function () {
    myCollection.removeAll();
    $scope.searchArr = filterFilter($scope.tasks, {name: $scope.filterAnt});
    setTimeout(function () {
      $scope.filterInitPlacemark();
    }, 10);
  };

  $scope.reloadSearch = function () {
    $scope.filterAnt = '';
    $scope.searchArr = filterFilter($scope.tasks, {name: $scope.filterAnt});
    setTimeout(function () {
      $scope.filterInitPlacemark();
    }, 10);
  }

  $scope.filterInitPlacemark = function () {
    arrPlacemark = [];

    for (var i = 0; i < $scope.searchArr.length; i++) {
      arrPlacemark[i] = new ymaps.Placemark([parseFloat($scope.searchArr[i].coordinateX), parseFloat($scope.searchArr[i].coordinateY)], {
      iconContent: $scope.searchArr[i].name.split(' ')[0].slice(0,1) + '. ' + $scope.searchArr[i].name.split(' ')[1],
      balloonContent: '<strong>' + $scope.searchArr[i].name + '</strong> <br /> <br />' + $scope.searchArr[i].comment + ' <br /><br /> Добавлена: ' + $scope.searchArr[i].time
    }, {
      preset: 'twirl#blueStretchyIcon'
    });

      myCollection.add(arrPlacemark[i]);
    };
  };

  $scope.funcInitPlacemark = function () {
    var interval = setInterval(function() {
      if ($scope.tasks[0]) {
        clearInterval(interval);
        arrPlacemark = [];
        myCollection = new ymaps.GeoObjectCollection();

        for (var i = 0; i < $scope.tasks.length; i++) {
          arrPlacemark[i] = new ymaps.Placemark([parseFloat($scope.tasks[i].coordinateX), parseFloat($scope.tasks[i].coordinateY)], {
          iconContent: $scope.tasks[i].name.split(' ')[0].slice(0,1) + '. ' + $scope.tasks[i].name.split(' ')[1],
          balloonContent: '<strong>' + $scope.tasks[i].name + '</strong> <br /> <br />' + $scope.tasks[i].comment + ' <br /><br /> Добавлена: ' + $scope.tasks[i].time
        }, {
          preset: 'twirl#blueStretchyIcon'
        });

          myCollection.add(arrPlacemark[i]);
        };
        myMap.geoObjects.add(myCollection);
      } else {
        $scope.tasks = Task.query();
      };
    }, 500);
  };

  // if ($scope.addPlacemarkCheck.check) {
  //   $('.ymaps-layers-pane').css({'-webkit-filter': 'grayscale(100%)'});
  // } else {
  //   $('.ymaps-layers-pane').css({'-webkit-filter': 'grayscale(0%)'});
  // }

  initPlacemark = function() {
    ymaps.ready(init);

    function init() {
      myMap = new ymaps.Map("map", {
          center: [35.76, 5],
          zoom: 2.5
      });

      // $('.wrapper-progress').css({'display': 'none'});
      document.getElementsByClassName("wrapper-progress")[0].style.display = 'none';

      myMap.behaviors.enable('scrollZoom');
      myMap.controls.add('typeSelector');
      myMap.controls.add('searchControl', {
        left: 5,
        top: 5
      });

      myMap.events.add('click', function (e) {
        if ($scope.addPlacemarkCheck.check) {
          if (!myMap.balloon.isOpen()) {
              var coords = e.get('coordPosition');
              myMap.balloon.open(coords, {
                  contentHeader:'Муравьи тут!'
              });
              $scope.coordinateInput(coords[0].toPrecision(10),coords[1].toPrecision(10));
              $scope.dateInput (new Date().toDateString());
              openModalPlace ();
          } else {
              myMap.balloon.close();
          };
        } else {
          return false;
        };
      });

      myMap.controls.add('zoomControl', {
        top: 40
      });

      $scope.funcInitPlacemark ();
    };
  };

  $scope.clearInput = function () {
    $scope.sender.name = '';
    $scope.sender.comment = '';
    $scope.sender.coordinateX = '';
    $scope.sender.coordinateY = '';
    $scope.sender.time = '';
  };

  $scope.coordinateInput = function (x,y) {
    document.getElementById('inputCoorX').value = x;
    document.getElementById('inputCoorY').value = y;
    $scope.sender.coordinateX = x;
    $scope.sender.coordinateY = y;
  };

  $scope.dateInput = function (time) {
    document.getElementById('time').value = time;
    $scope.sender.time = time;
  };

  $scope.send = function () {
    if ($scope.sender.name && $scope.sender.comment && !/[а-яА-ЯёЁ]/i.test($scope.sender.name)) {
      Task.save($scope.sender, function() {
        $scope.tasks = Task.query();
        $scope.funcInitPlacemark ();
        $scope.clearInput ();
        $scope.addPlacemarkCheckFunc();
        $('#modal1').closeModal();
      });
    } else {
      Materialize.toast('Поля не заполнены или название вида написано кириллицей', 4000);
    }
  }

  $scope.del = function (dele) {
    Task.remove({
      id: dele
    }, function() {
      $scope.tasks = Task.query();
    });
  }

}])

angular.module('mongolab', ['ngResource']).
factory('Task', function($resource) {
  var Task = $resource('https://api.mongolab.com/api/1/databases' + '/ant_map/collections/tasks/:id', {
    apiKey: 'qC0p98Z69-yRKg7gn7T0Nul0VPIrbyw9'
  }, {
    update: {
      method: 'PUT'
    }
  });

  return Task;
});

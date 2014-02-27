var app = angular.module('fx_gradcafe', ['ui.bootstrap', 'ngRoute']);

app.factory('AppAlert', [
	'$rootScope', function($rootScope) {
		var alertService;
		$rootScope.alerts = [];
		return alertService = {
			add: function(type, msg) {
				return $rootScope.alerts = [{
					type: type,
					msg: msg,
					close: function() {
						return alertService.closeAlert(this);
					}
				}];
			},
			closeAlert: function(alert) { return this.closeAlertIdx($rootScope.alerts.indexOf(alert)); },
			closeAlertIdx: function(index) { return $rootScope.alerts.splice(index, 1); },
		};
	}
]);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
		.when('/', {templateUrl: '/views/index.html'})
		.when('/about', {templateUrl: '/views/about.html'})
		.otherwise({redirectTo: '/'});
	}
]);

function graphController($scope, $http, AppAlert) {
	$scope.years = [{'value': 2014, 'label': 2014}, {'value': 2013, 'label': 2013}, {'value': 2012, 'label': 2012}];
	$scope.degrees = [{'value': "PhD", 'label': "PhD"}, {'value': "Masters", 'label': "MS"}];
	$scope.getUnivs = function(val) {
		console.log(val);
		return $http.get("http://boiling-sands-9001.herokuapp.com/autocomplete", { params: { term: val } }).then(function(res) {
			var addresses = [];
			console.log(res);
			angular.forEach(res.data, function(item) {
				addresses.push(item.univ);
			});
			return addresses;
		});
	};
	$scope.onSubmit = function() {
		if($scope.univ && $scope.year && $scope.degree) {
			$scope.loading = true;
			$http
			.post("http://boiling-sands-9001.herokuapp.com/fetch_univ", {'univ': $scope.univ, 'year': $scope.year, 'degree': $scope.degree})
			.success(function(data) {
				$scope.loading = false;
				if(data.status == "OK") {
					var ctx = document.getElementById("myChart").getContext("2d");
					myNewChart = new Chart(ctx).Line(data, {'scaleOverride': true, 'scaleSteps': 10, 'scaleStepWidth': 2, 'scaleStartValue': 0});
				} else if(data.status == "INVALID_VAL") {
					AppAlert.add("danger", "Please fill in all fields!");
				}
			})
			.error(function(data, status, headers, config) {
				$scope.loading = false;
				AppAlert.add("danger", "Could not connect to server!");
			});
		} else {
			AppAlert.add("danger", "please fill in all fields!");
		}
	}
}

function navigControl($scope) {
	$scope.isCollapsed = true;
}


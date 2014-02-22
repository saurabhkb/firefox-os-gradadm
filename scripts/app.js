var app = angular.module('fx_gradcafe', ['ui.bootstrap', 'ngRoute']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
		.when('/', {templateUrl: '/views/index.html'})
		.when('/about', {templateUrl: '/views/about.html'})
		.otherwise({redirectTo: '/'});
	}
]);

function graphController($scope, $http) {
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
			console.log(addresses);
			return addresses;
		});
	};
	$scope.onSubmit = function() {
		if($scope.univ && $scope.year && $scope.degree) {
			$http
			.post("http://boiling-sands-9001.herokuapp.com/fetch_univ", {'univ': $scope.univ, 'year': $scope.year, 'degree': $scope.degree})
			.success(function(data) {
				var ctx = document.getElementById("myChart").getContext("2d");
				myNewChart = new Chart(ctx).Line(data, {'scaleOverride': true, 'scaleSteps': 10, 'scaleStepWidth': 2, 'scaleStartValue': 0});
			});
		}
	}
}

function navigControl($scope) {
	$scope.isCollapsed = true;
}


var app = angular.module('fx_gradcafe', ['ngRoute']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
		.when('/', {templateUrl: '/views/index.html'})
		.when('/about', {templateUrl: '/views/about.html'})
		.when('/tech', {templateUrl: '/views/tech.html'})
		.otherwise({redirectTo: '/'});
	}
]);

$("document").ready(
	function() {
		url = "http://boiling-sands-9001.herokuapp.com"
		$.ajaxSetup({
			xhr: function() {return new window.XMLHttpRequest({mozSystem: true});},
			xhrFields: { mozSystem: true }
		});

		$("#tags").autocomplete({
			source: url + "/autocomplete",
			minLength: 2,
		});

		$('.alert .close').click(function(e) {
			$(this).parent().hide();
		});


		var ctx = $("#myChart").get(0).getContext("2d");
		var myNewChart;
		$("#univ_fetch").submit(
			function(e) {
				e.preventDefault();
				univ = $("#tags").val();
				year = $("#year").val();
				deg = $("#degree").val();
				if(!univ || !year || !deg) {
					$(".alert").show();
				} else {
					$.post(url + '/fetch_univ', {'univ': univ, 'year': year, 'degree': deg}, function(data) {
						d = JSON.parse(data);
						myNewChart = new Chart(ctx).Line(d, {'scaleOverride': true, 'scaleSteps': 10, 'scaleStepWidth': 2, 'scaleStartValue': 0});
					});
				}
			}
		);
	}
);


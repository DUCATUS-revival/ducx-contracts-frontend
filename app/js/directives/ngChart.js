var module = angular.module('Directives');
module.directive('ngChart', function($timeout) {
    var colors = ['#842734', '#024EA1', '#FFD902', '#EE7023', 'rgb(29, 161, 2)', 'rgb(161, 2, 158)'];
    return {
        restrict: 'A',
        replace: true,
        scope: {
            ngChart: '=',
            ngChartData: '=',
            ngChartOptions: '='
        },
        link: function ($scope, element) {
            var amChartOptions = {
                "type": "pie",
                "theme": "light",
                "colors": colors,
                "titleField": "title",
                "valueField": "value",
                "marginBottom": 35,
                "marginTop": 35,
                "marginLeft": 20,
                "marginRight": 20,
                "labelRadius": 4,
                "radius": "38%",
                "innerRadius": "60%",
                "labelText": "[[percents]]%",
                "labelTickColor": 'transparent',
                "fontSize": 12,
                "fontFamily": 'inherit',
                "balloonText": "[[value]]"
            };


            var chart = AmCharts.makeChart(element.get(0), amChartOptions);

            $scope.ngChartOptions.updater = function() {
                $timeout(function() {
                    var newData = [];
                    $scope.ngChartData.map(function(newDataItem, $index) {
                        newData.push({
                            title: newDataItem[$scope.ngChartOptions.itemLabel],
                            value: newDataItem[$scope.ngChartOptions.itemValue]
                        });
                        newDataItem.color = colors[$index];
                    });
                    chart.dataProvider = newData;
                    chart.validateData();
                });
            };

            $scope.$watch('ngChartData', $scope.ngChartOptions.updater);
            // $scope.ngChartOptions.auto ? $scope.ngChartOptions.updater() : false;
        }
    }
});
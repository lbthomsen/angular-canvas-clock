/*
 * app.js
 */
(function () {

    // Angular Application reaching a site where it should be broken up 
    // into separate .js files
    var app = angular.module("clock", [
        "body"
    ]);

    // ClockService - just for fun
    app.factory("TimerService",
        function ($log, $interval) {
            $log.debug("TimerService");

            var service = {
                now: new Date()
            };

            $interval(function () {
                service.now = new Date();
            }, 100);

            return service;
        }
    );

    app.directive('clock',
        function () {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                link: function (scope, element, attrs) {
                    scope.canvas = element[0];
                    scope.context = element[0].getContext('2d');

                    scope.canvas.height = scope.canvas.parentElement.clientHeight;
                    scope.canvas.width = scope.canvas.parentElement.clientWidth;

                    //scope.clockContext.font = "30px Arial";

                    //scope.clockContext.fillText("Hello World", 10, 50);
                },
                controller: ['$log', '$scope', 'TimerService',
                    function ($log, $scope, timerService) {
                        $log.debug("Clock Canvas Controller");
                        $log.debug("Scope: %o", $scope);

                        $scope.timerService = timerService;

                        $scope.$watch('timerService.now', function () {

                            // Calculate angle
                            var hourAngle = 0.5 * (60 * timerService.now.getHours() + timerService.now.getMinutes()) - 90;
                            var minuteAngle = 6 * timerService.now.getMinutes() - 90;
                            var secondAngle = 6 * timerService.now.getSeconds() + 6 / 1000 * timerService.now.getMilliseconds() - 90;

                            //$log.debug("Angles: hour=%d minute=%d second=%d", hourAngle, minuteAngle, secondAngle);

                            // So far so good - we can now calculate coordinates
                            var hourHandLength = Math.floor($scope.canvas.width * 0.2);
                            var minuteHandLength = Math.floor($scope.canvas.width * 0.4);
                            var secondHandLength = Math.floor($scope.canvas.width * 0.47);
                            
                            var center = {
                                x: Math.floor($scope.canvas.width / 2),
                                y: Math.floor($scope.canvas.height / 2)
                            };                            

                            var newHourHand = {
                                a: hourAngle,
                                x: Math.cos(hourAngle * Math.PI / 180) * hourHandLength + center.x,
                                y: Math.sin(hourAngle * Math.PI / 180) * hourHandLength + center.y
                            };

                            var newMinuteHand = {
                                a: minuteAngle,
                                x: Math.cos(minuteAngle * Math.PI / 180) * minuteHandLength + center.x,
                                y: Math.sin(minuteAngle * Math.PI / 180) * minuteHandLength + center.y
                            };

                            var newSecondHand = {
                                a: secondAngle,
                                x: Math.cos(secondAngle * Math.PI / 180) * secondHandLength + center.x,
                                y: Math.sin(secondAngle * Math.PI / 180) * secondHandLength + center.y
                            };

                            // $log.debug("Objects: %o %o %o", newHourHand, newMinuteHand, newSecondHand, center);
                            
                            $scope.context.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
                            
                            $scope.context.beginPath();
                            $scope.context.moveTo(center.x, center.y);
                            $scope.context.lineTo(newHourHand.x, newHourHand.y);
                            $scope.context.stroke();

                            $scope.context.beginPath();
                            $scope.context.moveTo(center.x, center.y);
                            $scope.context.lineTo(newMinuteHand.x, newMinuteHand.y);
                            $scope.context.stroke();

                            $scope.context.beginPath();
                            $scope.context.moveTo(center.x, center.y);
                            $scope.context.lineTo(newSecondHand.x, newSecondHand.y);
                            $scope.context.stroke();

                        });

                    }
                ],
                controllerAs: 'ctrl',
                bindToController: true,
                template: '<canvas width="100%" height="100%"></canvas>'
            };
        }
    );

    // The "body" module
    var body = angular.module("body", []);

    body.controller("BodyController", ['$log', '$scope', 'TimerService',
        function ($log, $scope, timerService) {

            $log.debug("BodyController");

            // Show the Loading...
            $scope.loading = true;

            // Just to illustrate a service that updates itself
            // in the background
            $scope.timerService = timerService;

            // Hide Loading...
            $scope.loading = false;

        }
    ]);

})();
/*
 * vim: ts=4 et nowrap autoindent
 */
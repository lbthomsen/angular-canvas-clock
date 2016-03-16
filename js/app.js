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
            }, 1000);

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
                    scope.ctx = element[0].getContext('2d');
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
                            var hourAngle = 0.5 * (60 * timerService.now.getHours() + timerService.now.getMinutes());
                            var minuteAngle = 6 * timerService.now.getMinutes();
                            var secondAngle = 6 * timerService.now.getSeconds() + 6 / 1000 * timerService.now.getMilliseconds();
                            
                            //$log.debug("Angles: hour=%d minute=%d second=%d", hourAngle, minuteAngle, secondAngle);
                            
                            // So far so good - we can now calculate coordinates
                            newHourHand = {
                                a: hourAngle, 
                                x: Math.cos(hourAngle * Math.PI / 180), 
                                y: Math.sin(hourAngle * Math.PI / 180)
                            };
                            
                            newMinuteHand = {
                                a: minuteAngle, 
                                x: Math.cos(minuteAngle * Math.PI / 180), 
                                y: Math.sin(minuteAngle * Math.PI / 180)
                            };
                            
                            newSecondHand = {
                                a: secondAngle, 
                                x: Math.cos(minuteAngle * Math.PI / 180), 
                                y: Math.sin(minuteAngle * Math.PI / 180)
                            };
                            
                            $log.debug("Objects: %o %o %o", newHourHand, newMinuteHand, newSecondHand);
                            
                            $log.debug("Tick");
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

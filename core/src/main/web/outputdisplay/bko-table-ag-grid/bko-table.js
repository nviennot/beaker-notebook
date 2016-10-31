/*
 *  Copyright 2016 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
/**
 * bkoProgress
 */
(function() {
  'use strict';
  beakerRegister.bkoDirective("TableAgGrid", ["$interval", "$compile", "$rootScope", "bkEvaluateJobManager", "bkUtils",
    "bkNotificationService", "bkOutputDisplayFactory", "bkSparkContextManager",
    function(
      $interval, $compile, $rootScope, bkEvaluateJobManager, bkUtils, bkNotificationService,
      bkOutputDisplayFactory, bkSparkContextManager) {
    return {
      template: JST['bko-table-ag-grid/bko-table'],
      require: '^bkOutputDisplay',
      controller: function($scope, $uibModal) {
      },
      link: function(scope, element, attrs, outputDisplayCtrl) {
        
        
        var gridDiv = document.querySelector('#mainGrid');

        var gridOptions = {
            columnDefs: [
                {headerName: 'Name', field: 'name'},
                {headerName: 'Role', field: 'role'}
            ],
            rowData: [
                {name: 'Niall', role: 'Developer'},
                {name: 'Eamon', role: 'Manager'},
                {name: 'Brian', role: 'Musician'},
                {name: 'Kevin', role: 'Manager'}
            ]
        };

        new agGrid.Grid(gridDiv, gridOptions);
        
/*        $scope.getCellModel()*/


      }
    };
  }]);
})();

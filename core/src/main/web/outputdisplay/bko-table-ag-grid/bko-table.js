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
  beakerRegister.bkoDirective("NewTable", ["$interval", "$compile", "$rootScope", "bkEvaluateJobManager", "bkUtils",
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
        
        scope.convertRows = function(input){
          var ret = [];
          for(var row = 0; row < input.length; row++){
            var rowObject = {};
            for(var element = 0; element < scope.columnNames.length; element++){
              rowObject['' + scope.columnNames[element]] = input[row][element];
            }
            ret.push(rowObject);
          }
          return ret;
        }
        
        scope.convertColumns = function(input){
          var ret = [];
          for(var i = 0; i < input.length; i++){
            ret.push({headerName: input[i], field: input[i]});
          }
          return ret;
        }

        scope.init = function() {
          scope.gridDiv = document.querySelector('#mainGrid');
          
          scope.columnNames = scope.model.getCellModel().columnNames;
          scope.types = scope.model.getCellModel().types;
          scope.values = scope.model.getCellModel().values;
          scope.convertedColumns = scope.convertColumns(scope.columnNames);
          scope.convertedRows = scope.convertRows(scope.values);

          var gridOptions = {
              rowDeselection: true,
              enableColResize: true,
              enableFilter: true,
              enableSorting: true,
              columnDefs: scope.convertedColumns,
              rowData: scope.convertedRows,
          };
          new agGrid.Grid(scope.gridDiv, gridOptions);
          
          //gridOptions.api.sizeColumnsToFit();
          
          var allColumnIds = [];
          scope.columnNames.forEach( function(columnDef) {
              allColumnIds.push(columnDef);
          });
          gridOptions.columnApi.autoSizeColumns(allColumnIds);
        }
        
        scope.init();
      }
    };
  }]);
})();

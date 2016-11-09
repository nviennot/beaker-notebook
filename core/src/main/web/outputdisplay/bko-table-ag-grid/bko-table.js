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
        
        var convertRows = function(input){
          var ret = [];
          for(var row = 0; row < input.length; row++){
            var rowObject = {};
            for(var element = 0; element < $scope.columnNames.length; element++){
              rowObject['' + $scope.columnNames[element]] = input[row][element];
            }
            ret.push(rowObject);
          }
          return ret;
        }

        var convertColumns = function(input){
          var ret = [];
          for(var i = 0; i < input.length; i++){
            ret.push({headerName: input[i], field: input[i]});
          }
          return ret;
        }
        
        var fitTableToCollumns = function(){
          var width = 0;
          $scope.gridOptions.columnApi.getAllDisplayedColumns().forEach( function(col) {
            width += col.actualWidth;
          });
          setTimeout(function(){//wait for document ready
            var tableDiv = document.getElementById($scope.id);
            tableDiv.style.width = (width + 10) + 'px'; //TODO 10 is width of scroll, replace with real
          }, 0);
        }
        
        var onGridReady = function(){
          console.log('onGridReady'); //TODO delete , need to understand how often its called.
          var allColumnIds = [];
          $scope.columnNames.forEach( function(columnDef) {
              allColumnIds.push(columnDef);
          });
          $scope.gridOptions.columnApi.autoSizeColumns(allColumnIds);
        }
        
        $scope.agClass = function (){
          var ret = "ag-fresh";
          switch(bkHelper.getTheme().toUpperCase()){
            case 'DEFAULT':
              ret = "ag-fresh";
            break;
            case 'AMBIANCE':
              ret = "ag-dark";
            break;
          }
          return ret;
        }
        
        //TODO delete if not used
        var softApplay = function(){
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
          }
        }

        $scope.init = function() {
          
          $scope.id = 'table_' + bkUtils.generateId(6);
  
          $scope.columnNames = $scope.model.getCellModel().columnNames;
          $scope.types = $scope.model.getCellModel().types;
          $scope.values = $scope.model.getCellModel().values;
          
          $scope.convertedColumns = convertColumns($scope.columnNames);
          $scope.convertedRows = convertRows($scope.values);

          $scope.gridOptions = {
              suppressHorizontalScroll: true,
              rowDeselection: true,
              enableColResize: true,
              enableFilter: true,
              enableSorting: true,
              columnDefs: $scope.convertedColumns,
              rowData: $scope.convertedRows,
              onColumnResized: fitTableToCollumns,
              onGridReady: onGridReady,
          };      

        }
 
        $scope.init();

      },
      link: function(scope, element, attrs, outputDisplayCtrl) {


      }
    };
  }]);
})();

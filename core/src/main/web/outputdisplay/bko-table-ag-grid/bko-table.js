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
    
    var TIME_UNIT_FORMATS = {
        DATETIME:     { title: 'datetime', format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ' },
        DAYS:         { title: 'date', format: 'YYYY-MM-DD' },
        HOURS:        { title: 'hours', format: 'YYYY-MM-DD HH:mm ZZ' },
        MINUTES:      { title: 'minutes', format: 'HH:mm ZZ' },
        SECONDS:      { title: 'seconds', format: 'HH:mm:ss ZZ' },
        MILLISECONDS: { title: 'milliseconds', format: 'HH:mm:ss.SSS ZZ' }
      };
    
    return {
      template: JST['bko-table-ag-grid/bko-table'],
      require: '^bkOutputDisplay',
      controller: function($scope, $uibModal) {
        
        var getVerticalScrollBarWidth = function(){
          return 12;//TODO replace with real
        }
        
        var getHorizantalScrollBarWidth = function(){
          return 12;//TODO replace with real
        }
        
        var getRowHeight = function(){
          return 25;
        }
        
        var getHeaderHeight = function(){
          return 25;
        }
        
        $scope.getRowCountToShow = function(){
          return 20;//TODO replace with user menu 
        }

        $scope.getActualRowCountToShow = function(){
          var rowCount = $scope.getRowCountToShow();
          if($scope.values.length < rowCount){
            rowCount = $scope.values.length;
          }
          return rowCount;
        }
        
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
            var retItem = {
                headerName: '' + input[i],
                field: '' + input[i],
            };
            if($scope.types[i] == 'datetime'){
              retItem.cellRenderer = function (params) {
                return bkUtils.formatTimestamp(params.value.timestamp, null, TIME_UNIT_FORMATS.DATETIME.format);
              }
            }
            ret.push(retItem);
          }
          return ret;
        }
        
        var setTableWidth = function(){
          setTimeout(function(){//wait for document ready
            
            var width = 0;
            $scope.gridOptions.columnApi.getAllDisplayedColumns().forEach( function(col) {
              width += col.actualWidth;
            });

            width += getVerticalScrollBarWidth();
            var tableParentDiv = document.getElementById($scope.id_parent);
            
            if(tableParentDiv.offsetWidth >= width){
              document.getElementById($scope.id).style.width = width + 'px';
            }else{
              document.getElementById($scope.id).style.width = tableParentDiv.offsetWidth + 'px';
            }
          }, 0);
        }

        var onGridReady = function(){
          var allColumnIds = [];
          $scope.columnNames.forEach( function(columnDef) {
              allColumnIds.push(columnDef);
          });
          $scope.gridOptions.columnApi.autoSizeColumns(allColumnIds);
          setTableHeight();
        }
        
        var onPageResized = function(){
          setTableHeight();
          setTableWidth();
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
        
        var setTableHeight = function(){
          setTimeout(function(){//wait for document ready
            var width = 0;
            $scope.gridOptions.columnApi.getAllDisplayedColumns().forEach( function(col) {
              width += col.actualWidth;
            });

            width += getVerticalScrollBarWidth();
            var tableParentDiv = document.getElementById($scope.id_parent);
            
            var ret = $scope.getActualRowCountToShow() * getRowHeight() + getHeaderHeight() + 2 + 3; //borders
            if(tableParentDiv.offsetWidth < width){
              ret +=10;
            }
            document.getElementById($scope.id).style.height = ret + 'px';
            
          }, 0);
        }

        $scope.init = function() {
          
          $scope.id = 'table_' + bkUtils.generateId(6);
          $scope.id_parent = $scope.id + '_parent';
  
          $scope.columnNames = $scope.model.getCellModel().columnNames;
          $scope.types = $scope.model.getCellModel().types;
          $scope.values = $scope.model.getCellModel().values;
          
          $scope.convertedColumns = convertColumns($scope.columnNames);
          $scope.convertedRows = convertRows($scope.values);

          $scope.gridOptions = {
              //suppressHorizontalScroll: true,
              headerHeight: getHeaderHeight(),
              rowHeight: getRowHeight(),
              rowDeselection: true,
              enableColResize: true,
              enableFilter: true,
              enableSorting: true,
              columnDefs: $scope.convertedColumns,
              rowData: $scope.convertedRows,
              onColumnResized: setTableWidth,
              onGridReady: onGridReady,
          };
          
          $(window).bind('resize.' + $scope.id, function () {
            onPageResized();
          });
        }

        $scope.init();

      },
      link: function(scope, element, attrs, outputDisplayCtrl) {


      }
    };
  }]);
})();
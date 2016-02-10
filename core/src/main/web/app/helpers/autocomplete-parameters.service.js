/*
 *  Copyright 2014 TWO SIGMA OPEN SOURCE, LLC
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

(function() {
  'use strict';
  angular.module('bk.core').factory('autocompleteParametersService', function() {

    var markConfig = {
      clearWhenEmpty: false,
      inclusiveLeft: true,
      inclusiveRight: true
    };

    var params = [];
    var cm;
    var scope;
    var currentParam;
    var args = [];

    function startParameterCompletion(codeMirror, documentation, selectionStart, selectionEnd, $scope) {
      cm = codeMirror;
      params = documentation.parameters;
      scope = $scope;
      markParameters(selectionStart, selectionEnd);
      cm.on('cursorActivity', endCompletionIfCursorOutOfRange);
      nextParameter();
    }

    function endCompletionIfCursorOutOfRange(cm) {
      if (!isActive()) {
        return;
      }
      if (!cursorInRange(getCompletionRange())) {
        return endCompletion();
      }

      if (cursorInRange(args[currentParam].find())) {
        return showParameterDocumentation(params[currentParam]);
      }

      var activeArgumentIndex = getArgumentIndexUnderCursor();
      if (activeArgumentIndex === -1 || _.isUndefined(activeArgumentIndex)) {
        return hideParameterDocumentation();
      }
      toParam(activeArgumentIndex);

    }

    function getArgumentIndexUnderCursor() {
      return _.findIndex(args, function(arg) {
        return cursorInRange(arg.find());
      });
    }

    function cursorInRange(range) {
      var cursor = cm.getCursor('anchor');
      return cursor.line >= range.from.line &&
        cursor.line <= range.to.line &&
        cursor.ch >= range.from.ch &&
        cursor.ch <= range.to.ch;
    }

    function getCompletionRange() {
      return {from: args[0].find().from, to: _.last(args).find().to};
    }

    function markParameters(from, to) {
      var paramsString = cm.getRange(from, to);
      args = _(params).map(function(p) {
        var position = paramsString.indexOf(p.name);
        return [position, position + p.name.length - 1];
      }).map(function(p) {
        var start = _.merge({}, from, {ch: from.ch + p[0]});
        var end = _.merge({}, from, {ch: from.ch + p[1] + 1});
        return markWithClass(start, end, 'marked-argument-unchanged');
      }).value();
    }

    function markWithClass(start, end, className) {
      return cm.markText(start, end, _.merge({}, {className: className}, markConfig));
    }

    function nextParameter() {
      if (currentParam === params.length - 1) {
        return endCompletionAndMoveCursor();
      }
      toParam(_.isUndefined(currentParam) ? 0 : currentParam + 1);
    }

    function previousParameter() {
      if (currentParam === 0) {
        return endCompletionAndMoveCursor();
      }

      toParam(_.isUndefined(currentParam) ? params.length - 1 : currentParam - 1);
    }

    function toParam(index) {
      if (! _.isUndefined(currentParam)) {
        params[currentParam].argument = args[currentParam].find();
        markArgumentIfChanged();
      }
      currentParam = index;
      selectArgument(currentParam);
      showParameterDocumentation(params[currentParam]);
    }

    function markArgumentIfChanged() {
      var p = params[currentParam]
      if (cm.getRange(p.argument.from, p.argument.to) !== p.name) {
        args[currentParam].clear();
        args[currentParam] = markWithClass(p.argument.from, p.argument.to, 'marked-argument-changed');
      }
    }

    function isActive() {
      return !(_.isEmpty(params));
    }

    function endCompletion() {
      cm.off('cursorActivity', endCompletionIfCursorOutOfRange);
      hideParameterDocumentation();
      clearMarks()
      cm = void 0;
      currentParam = void 0;
      scope = void 0;
      params = [];
      args = [];
    }

    function endCompletionAndMoveCursor() {
      var lastArg = _.last(args).find();
      cm.setCursor(_.merge({}, lastArg.to, {ch: lastArg.to.ch + 1}));
      endCompletion();
    }

    function selectArgument(i) {
      var arg = args[i].find();
      cm.setSelection(arg.from, arg.to);
    }

    function clearMarks() {
      _.forEach(args, function(arg) {
        arg.clear();
      });
    }

    function showParameterDocumentation(param) {
      scope.$broadcast('showParameterDocumentation', param.description);
    }

    function hideParameterDocumentation() {
      scope.$broadcast('hideParameterDocumentation');
    }

    return {
      startParameterCompletion: startParameterCompletion,
      isActive: isActive,
      nextParameter: nextParameter,
      previousParameter: previousParameter,
      endCompletion: endCompletionAndMoveCursor
    };

  });
})();

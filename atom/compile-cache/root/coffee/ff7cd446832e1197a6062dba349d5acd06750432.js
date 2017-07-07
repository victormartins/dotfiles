(function() {
  var BracketMatchingMotion, Find, Motions, MoveToMark, RepeatSearch, Search, SearchCurrentWord, Till, ref, ref1;

  Motions = require('./general-motions');

  ref = require('./search-motion'), Search = ref.Search, SearchCurrentWord = ref.SearchCurrentWord, BracketMatchingMotion = ref.BracketMatchingMotion, RepeatSearch = ref.RepeatSearch;

  MoveToMark = require('./move-to-mark-motion');

  ref1 = require('./find-motion'), Find = ref1.Find, Till = ref1.Till;

  Motions.Search = Search;

  Motions.SearchCurrentWord = SearchCurrentWord;

  Motions.BracketMatchingMotion = BracketMatchingMotion;

  Motions.RepeatSearch = RepeatSearch;

  Motions.MoveToMark = MoveToMark;

  Motions.Find = Find;

  Motions.Till = Till;

  module.exports = Motions;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvdmltLW1vZGUvbGliL21vdGlvbnMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG1CQUFSOztFQUNWLE1BQW1FLE9BQUEsQ0FBUSxpQkFBUixDQUFuRSxFQUFDLG1CQUFELEVBQVMseUNBQVQsRUFBNEIsaURBQTVCLEVBQW1EOztFQUNuRCxVQUFBLEdBQWEsT0FBQSxDQUFRLHVCQUFSOztFQUNiLE9BQWUsT0FBQSxDQUFRLGVBQVIsQ0FBZixFQUFDLGdCQUFELEVBQU87O0VBRVAsT0FBTyxDQUFDLE1BQVIsR0FBaUI7O0VBQ2pCLE9BQU8sQ0FBQyxpQkFBUixHQUE0Qjs7RUFDNUIsT0FBTyxDQUFDLHFCQUFSLEdBQWdDOztFQUNoQyxPQUFPLENBQUMsWUFBUixHQUF1Qjs7RUFDdkIsT0FBTyxDQUFDLFVBQVIsR0FBcUI7O0VBQ3JCLE9BQU8sQ0FBQyxJQUFSLEdBQWU7O0VBQ2YsT0FBTyxDQUFDLElBQVIsR0FBZTs7RUFFZixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQWJqQiIsInNvdXJjZXNDb250ZW50IjpbIk1vdGlvbnMgPSByZXF1aXJlICcuL2dlbmVyYWwtbW90aW9ucydcbntTZWFyY2gsIFNlYXJjaEN1cnJlbnRXb3JkLCBCcmFja2V0TWF0Y2hpbmdNb3Rpb24sIFJlcGVhdFNlYXJjaH0gPSByZXF1aXJlICcuL3NlYXJjaC1tb3Rpb24nXG5Nb3ZlVG9NYXJrID0gcmVxdWlyZSAnLi9tb3ZlLXRvLW1hcmstbW90aW9uJ1xue0ZpbmQsIFRpbGx9ID0gcmVxdWlyZSAnLi9maW5kLW1vdGlvbidcblxuTW90aW9ucy5TZWFyY2ggPSBTZWFyY2hcbk1vdGlvbnMuU2VhcmNoQ3VycmVudFdvcmQgPSBTZWFyY2hDdXJyZW50V29yZFxuTW90aW9ucy5CcmFja2V0TWF0Y2hpbmdNb3Rpb24gPSBCcmFja2V0TWF0Y2hpbmdNb3Rpb25cbk1vdGlvbnMuUmVwZWF0U2VhcmNoID0gUmVwZWF0U2VhcmNoXG5Nb3Rpb25zLk1vdmVUb01hcmsgPSBNb3ZlVG9NYXJrXG5Nb3Rpb25zLkZpbmQgPSBGaW5kXG5Nb3Rpb25zLlRpbGwgPSBUaWxsXG5cbm1vZHVsZS5leHBvcnRzID0gTW90aW9uc1xuIl19

(function() {
  var IncreaseOperators, IndentOperators, InputOperators, Operators, Put, Replace, _;

  _ = require('underscore-plus');

  IndentOperators = require('./indent-operators');

  IncreaseOperators = require('./increase-operators');

  Put = require('./put-operator');

  InputOperators = require('./input');

  Replace = require('./replace-operator');

  Operators = require('./general-operators');

  Operators.Put = Put;

  Operators.Replace = Replace;

  _.extend(Operators, IndentOperators);

  _.extend(Operators, IncreaseOperators);

  _.extend(Operators, InputOperators);

  module.exports = Operators;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvdmltLW1vZGUvbGliL29wZXJhdG9ycy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVI7O0VBQ2xCLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSxzQkFBUjs7RUFDcEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxnQkFBUjs7RUFDTixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxTQUFSOztFQUNqQixPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSOztFQUNWLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVI7O0VBRVosU0FBUyxDQUFDLEdBQVYsR0FBZ0I7O0VBQ2hCLFNBQVMsQ0FBQyxPQUFWLEdBQW9COztFQUNwQixDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsRUFBb0IsZUFBcEI7O0VBQ0EsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxTQUFULEVBQW9CLGlCQUFwQjs7RUFDQSxDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsRUFBb0IsY0FBcEI7O0VBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFiakIiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuSW5kZW50T3BlcmF0b3JzID0gcmVxdWlyZSAnLi9pbmRlbnQtb3BlcmF0b3JzJ1xuSW5jcmVhc2VPcGVyYXRvcnMgPSByZXF1aXJlICcuL2luY3JlYXNlLW9wZXJhdG9ycydcblB1dCA9IHJlcXVpcmUgJy4vcHV0LW9wZXJhdG9yJ1xuSW5wdXRPcGVyYXRvcnMgPSByZXF1aXJlICcuL2lucHV0J1xuUmVwbGFjZSA9IHJlcXVpcmUgJy4vcmVwbGFjZS1vcGVyYXRvcidcbk9wZXJhdG9ycyA9IHJlcXVpcmUgJy4vZ2VuZXJhbC1vcGVyYXRvcnMnXG5cbk9wZXJhdG9ycy5QdXQgPSBQdXRcbk9wZXJhdG9ycy5SZXBsYWNlID0gUmVwbGFjZVxuXy5leHRlbmQoT3BlcmF0b3JzLCBJbmRlbnRPcGVyYXRvcnMpXG5fLmV4dGVuZChPcGVyYXRvcnMsIEluY3JlYXNlT3BlcmF0b3JzKVxuXy5leHRlbmQoT3BlcmF0b3JzLCBJbnB1dE9wZXJhdG9ycylcbm1vZHVsZS5leHBvcnRzID0gT3BlcmF0b3JzXG4iXX0=

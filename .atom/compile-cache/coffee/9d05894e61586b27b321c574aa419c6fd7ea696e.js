
/*
Global Logger
 */

(function() {
  module.exports = (function() {
    var Emitter, emitter, levels, stream, winston, writable;
    Emitter = require('event-kit').Emitter;
    emitter = new Emitter();
    winston = require('winston');
    stream = require('stream');
    writable = new stream.Writable();
    writable._write = function(chunk, encoding, next) {
      var msg;
      msg = chunk.toString();
      emitter.emit('logging', msg);
      return next();
    };
    levels = {
      silly: 0,
      input: 1,
      verbose: 2,
      prompt: 3,
      debug: 4,
      info: 5,
      data: 6,
      help: 7,
      warn: 8,
      error: 9
    };
    return function(label) {
      var logger, loggerMethods, method, transport, wlogger, _i, _len;
      transport = new winston.transports.File({
        label: label,
        level: 'debug',
        timestamp: true,
        stream: writable,
        json: false
      });
      wlogger = new winston.Logger({
        transports: [transport]
      });
      wlogger.on('logging', function(transport, level, msg, meta) {
        var levelNum, loggerLevel, loggerLevelNum, path, _ref;
        loggerLevel = (_ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify._loggerLevel') : void 0) != null ? _ref : "warn";
        loggerLevelNum = levels[loggerLevel];
        levelNum = levels[level];
        if (loggerLevelNum <= levelNum) {
          path = require('path');
          label = "" + (path.dirname(transport.label).split(path.sep).reverse()[0]) + "" + path.sep + (path.basename(transport.label));
          return console.log("" + label + " [" + level + "]: " + msg, meta);
        }
      });
      loggerMethods = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
      logger = {};
      for (_i = 0, _len = loggerMethods.length; _i < _len; _i++) {
        method = loggerMethods[_i];
        logger[method] = wlogger[method];
      }
      logger.onLogging = function(handler) {
        var subscription;
        subscription = emitter.on('logging', handler);
        return subscription;
      };
      return logger;
    };
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xvZ2dlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBb0IsQ0FBQSxTQUFBLEdBQUE7QUFFbEIsUUFBQSxtREFBQTtBQUFBLElBQUMsVUFBVyxPQUFBLENBQVEsV0FBUixFQUFYLE9BQUQsQ0FBQTtBQUFBLElBQ0EsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFBLENBRGQsQ0FBQTtBQUFBLElBSUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBSlYsQ0FBQTtBQUFBLElBS0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBTFQsQ0FBQTtBQUFBLElBTUEsUUFBQSxHQUFlLElBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQU5mLENBQUE7QUFBQSxJQU9BLFFBQVEsQ0FBQyxNQUFULEdBQWtCLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsSUFBbEIsR0FBQTtBQUNoQixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxLQUFLLENBQUMsUUFBTixDQUFBLENBQU4sQ0FBQTtBQUFBLE1BRUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFiLEVBQXdCLEdBQXhCLENBRkEsQ0FBQTthQUdBLElBQUEsQ0FBQSxFQUpnQjtJQUFBLENBUGxCLENBQUE7QUFBQSxJQWFBLE1BQUEsR0FBUztBQUFBLE1BQ1AsS0FBQSxFQUFPLENBREE7QUFBQSxNQUVQLEtBQUEsRUFBTyxDQUZBO0FBQUEsTUFHUCxPQUFBLEVBQVMsQ0FIRjtBQUFBLE1BSVAsTUFBQSxFQUFRLENBSkQ7QUFBQSxNQUtQLEtBQUEsRUFBTyxDQUxBO0FBQUEsTUFNUCxJQUFBLEVBQU0sQ0FOQztB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

//# sourceURL=/Users/victor.martins/.atom/packages/atom-beautify/src/logger.coffee

(function() {
  var DEFAULT_INDENT, DEFAULT_WARN_FN, adjust_space;

  DEFAULT_INDENT = '    ';

  adjust_space = function(line) {
    var comment, muli_string, string_list;
    string_list = line.match(/(['"])[^\1]*?\1/g);
    muli_string = line.match(/\[(=*)\[([^\]\1\]]*)/);
    comment = line.match(/\-{2}[^\[].*$/);
    line = line.replace(/\s+/g, ' ');
    line = line.replace(/\s?(==|>=|<=|~=|[=><\+\*\/])\s?/g, ' $1 ');
    line = line.replace(/([^=e\-\(\s])\s?\-\s?([^\-\[])/g, '$1 - $2');
    line = line.replace(/([^\d])e\s?\-\s?([^\-\[])/g, '$1e - $2');
    line = line.replace(/,([^\s])/g, ', $1');
    line = line.replace(/\s+,/g, ',');
    line = line.replace(/(['"])[^\1]*?\1/g, function() {
      return string_list.shift();
    });
    if (muli_string && muli_string[0]) {
      line = line.replace(/\[(=*)\[([^\]\1\]]*)/, muli_string[0]);
    }
    if (comment && comment[0]) {
      line = line.replace(/\-{2}[^\[].*$/, comment[0]);
    }
    return line;
  };

  DEFAULT_WARN_FN = function(msg) {
    return console.log('WARNING:', msg);
  };

  module.exports = function(str, indent, warn_fn, opts) {
    var $currIndent, $extIndent, $lastIndent, $nextIndent, $prevLength, $template, eol, new_code;
    if (opts == null) {
      opts = {};
    }
    eol = (opts != null ? opts.eol : void 0) || '\n';
    indent = indent || DEFAULT_INDENT;
    warn_fn = typeof warn_fn === 'function' ? warn_fn : DEFAULT_WARN_FN;
    if (Number.isInteger(indent)) {
      indent = ' '.repeat(indent);
    }
    $currIndent = 0;
    $nextIndent = 0;
    $prevLength = 0;
    $extIndent = 0;
    $lastIndent = 0;
    $template = 0;
    new_code = str.split(/\r?\n/g).map(function(line, line_number) {
      var $brackets, $curly, $template_flag, $useful, arr, code, comment, new_line, raw_line, res1, res2;
      $template_flag = false;
      if ($template) {
        res2 = line.match(/\](=*)\]/);
        if (res2 && $template === res2[1].length + 1) {
          $template_flag = true;
          if ($template && !/]=*]$/.test(line)) {
            arr = line.split(/\]=*\]/, 2);
            comment = arr[0];
            code = arr[1];
            line = comment + ']' + '='.repeat($template - 1) + ']' + adjust_space(code);
            $template = 0;
          }
          $template = 0;
        } else {
          return line;
        }
      }
      res1 = line.match(/\[(=*)\[/);
      if (res1) {
        $template = res1[1].length + 1;
      }
      if (!$template_flag) {
        line = line.trim();
        line = adjust_space(line);
      }
      if (!line.length) {
        return '';
      }
      raw_line = line;
      line = line.replace(/(['"])[^\1]*?\1/, '');
      line = line.replace(/\s*--.+/, '');
      if (/^((local )?function|repeat|while)\b/.test(line) && !/\bend\s*[\),;]*$/.test(line) || /\b(then|do)$/.test(line) && !/^elseif\b/.test(line) || /^if\b/.test(line) && /\bthen\b/.test(line) && !/\bend$/.test(line) || /\bfunction ?(?:\w+ )?\([^\)]*\)$/.test(line) && !/\bend$/.test(line)) {
        $nextIndent = $currIndent + 1;
      } else if (/^until\b/.test(line) || /^end\s*[\),;]*$/.test(line) || /^end\s*\)\s*\.\./.test(line) || /^else(if)?\b/.test(line) && /\bend$/.test(line)) {
        $nextIndent = --$currIndent;
      } else if (/^else\b/.test(line) || /^elseif\b/.test(line)) {
        $nextIndent = $currIndent;
        $currIndent = $currIndent - 1;
      }
      $brackets = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      $curly = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if ($curly < 0) {
        $currIndent += $curly;
      }
      if ($brackets < 0) {
        $currIndent += $brackets;
      }
      $nextIndent += $brackets + $curly;
      if ($currIndent - $lastIndent > 1) {
        $extIndent += $nextIndent - $lastIndent - 1;
        $nextIndent = $currIndent = 1 + $lastIndent;
      }
      if ($currIndent - $lastIndent < -1 && $extIndent > 0) {
        $extIndent += $currIndent - $lastIndent + 1;
        $currIndent = -1 + $lastIndent;
      }
      if ($nextIndent < $currIndent) {
        $nextIndent = $currIndent;
      }
      if ($currIndent < 0) {
        warn_fn("negative indentation at line " + line_number + ": " + raw_line);
      }
      new_line = (raw_line.length && $currIndent > 0 && !$template_flag ? indent.repeat($currIndent) : '') + raw_line;
      $useful = $prevLength > 0 || raw_line.length > 0;
      $lastIndent = $currIndent;
      $currIndent = $nextIndent;
      $prevLength = raw_line.length;
      return new_line || void 0;
    });
    if ($currIndent > 0) {
      warn_fn('positive indentation at the end');
    }
    return new_code.join(eol);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbHVhLWJlYXV0aWZpZXIvYmVhdXRpZmllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGNBQUEsR0FBaUI7O0VBRWpCLFlBQUEsR0FBZSxTQUFDLElBQUQ7QUFDYixRQUFBO0lBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFMLENBQVcsa0JBQVg7SUFDZCxXQUFBLEdBQWMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxzQkFBWDtJQUNkLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLGVBQVg7SUFDVixJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEdBQXJCO0lBRVAsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsa0NBQWIsRUFBaUQsTUFBakQ7SUFFUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQ0FBYixFQUFnRCxTQUFoRDtJQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLDRCQUFiLEVBQTJDLFVBQTNDO0lBRVAsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsV0FBYixFQUEwQixNQUExQjtJQUVQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFBc0IsR0FBdEI7SUFFUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxrQkFBYixFQUFpQyxTQUFBO2FBQ3RDLFdBQVcsQ0FBQyxLQUFaLENBQUE7SUFEc0MsQ0FBakM7SUFFUCxJQUFHLFdBQUEsSUFBZ0IsV0FBWSxDQUFBLENBQUEsQ0FBL0I7TUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxzQkFBYixFQUFxQyxXQUFZLENBQUEsQ0FBQSxDQUFqRCxFQURUOztJQUVB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UUFDRSxXQUFBLElBQWUsVUFEakI7O01BRUEsV0FBQSxJQUFlLFNBQUEsR0FBWTtNQUUzQixJQUFHLFdBQUEsR0FBYyxXQUFkLEdBQTRCLENBQS9CO1FBQ0UsVUFBQSxJQUFjLFdBQUEsR0FBYyxXQUFkLEdBQTRCO1FBQzFDLFdBQUEsR0FBYyxXQUFBLEdBQWMsQ0FBQSxHQUFJLFlBRmxDOztNQUdBLElBQUcsV0FBQSxHQUFjLFdBQWQsR0FBNEIsQ0FBQyxDQUE3QixJQUFtQyxVQUFBLEdBQWEsQ0FBbkQ7UUFDRSxVQUFBLElBQWMsV0FBQSxHQUFjLFdBQWQsR0FBNEI7UUFDMUMsV0FBQSxHQUFjLENBQUMsQ0FBRCxHQUFLLFlBRnJCOztNQUdBLElBQUcsV0FBQSxHQUFjLFdBQWpCO1FBQ0UsV0FBQSxHQUFjLFlBRGhCOztNQUdBLElBQTBFLFdBQUEsR0FBYyxDQUF4RjtRQUFBLE9BQUEsQ0FBUSwrQkFBQSxHQUFrQyxXQUFsQyxHQUE4QyxJQUE5QyxHQUFrRCxRQUExRCxFQUFBOztNQUNBLFFBQUEsR0FBVyxDQUFJLFFBQVEsQ0FBQyxNQUFULElBQW9CLFdBQUEsR0FBYyxDQUFsQyxJQUF3QyxDQUFDLGNBQTVDLEdBQWdFLE1BQU0sQ0FBQyxNQUFQLENBQWMsV0FBZCxDQUFoRSxHQUFnRyxFQUFqRyxDQUFBLEdBQXVHO01BQ2xILE9BQUEsR0FBVSxXQUFBLEdBQWMsQ0FBZCxJQUFtQixRQUFRLENBQUMsTUFBVCxHQUFrQjtNQUMvQyxXQUFBLEdBQWM7TUFDZCxXQUFBLEdBQWM7TUFDZCxXQUFBLEdBQWMsUUFBUSxDQUFDO2FBQ3ZCLFFBQUEsSUFBWTtJQTlEcUIsQ0FBeEI7SUFnRVgsSUFBNkMsV0FBQSxHQUFjLENBQTNEO01BQUEsT0FBQSxDQUFRLGlDQUFSLEVBQUE7O1dBQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkO0VBNUVlO0FBNUJqQiIsInNvdXJjZXNDb250ZW50IjpbIkRFRkFVTFRfSU5ERU5UID0gJyAgICAnXG5cbmFkanVzdF9zcGFjZSA9IChsaW5lKSAtPlxuICBzdHJpbmdfbGlzdCA9IGxpbmUubWF0Y2ggLyhbJ1wiXSlbXlxcMV0qP1xcMS9nXG4gIG11bGlfc3RyaW5nID0gbGluZS5tYXRjaCAvXFxbKD0qKVxcWyhbXlxcXVxcMVxcXV0qKS9cbiAgY29tbWVudCA9IGxpbmUubWF0Y2ggL1xcLXsyfVteXFxbXS4qJC9cbiAgbGluZSA9IGxpbmUucmVwbGFjZSAvXFxzKy9nLCAnICdcbiAgIyByZXBsYWNlIGFsbCB3aGl0ZXNwYWNlcyBpbnNpZGUgdGhlIHN0cmluZyB3aXRoIG9uZSBzcGFjZSwgV0FSTklORzogdGhlIHdoaXRlc3BhY2VzIGluIHN0cmluZyB3aWxsIGJlIHJlcGxhY2UgdG9vIVxuICBsaW5lID0gbGluZS5yZXBsYWNlIC9cXHM/KD09fD49fDw9fH49fFs9PjxcXCtcXCpcXC9dKVxccz8vZywgJyAkMSAnXG4gICMgYWRkIHdoaXRlc3BhY2UgYXJvdW5kIHRoZSBvcGVyYXRvclxuICBsaW5lID0gbGluZS5yZXBsYWNlIC8oW149ZVxcLVxcKFxcc10pXFxzP1xcLVxccz8oW15cXC1cXFtdKS9nLCAnJDEgLSAkMidcbiAgbGluZSA9IGxpbmUucmVwbGFjZSAvKFteXFxkXSllXFxzP1xcLVxccz8oW15cXC1cXFtdKS9nLCAnJDFlIC0gJDInXG4gICMganVzdCBmb3JtYXQgbWludXMsIG5vdCBmb3IgLS0gb3IgbmVnYXRpdmUgbnVtYmVyIG9yIGNvbW1lbnRhcnkuXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UgLywoW15cXHNdKS9nLCAnLCAkMSdcbiAgIyBhZGp1c3QgJywnXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UgL1xccyssL2csICcsJ1xuICAjIHJlY292ZXIgdGhlIHdoaXRlc3BhY2VzIGluIHN0cmluZy5cbiAgbGluZSA9IGxpbmUucmVwbGFjZSAvKFsnXCJdKVteXFwxXSo/XFwxL2csIC0+XG4gICAgc3RyaW5nX2xpc3Quc2hpZnQoKVxuICBpZiBtdWxpX3N0cmluZyBhbmQgbXVsaV9zdHJpbmdbMF1cbiAgICBsaW5lID0gbGluZS5yZXBsYWNlIC9cXFsoPSopXFxbKFteXFxdXFwxXFxdXSopLywgbXVsaV9zdHJpbmdbMF1cbiAgaWYgY29tbWVudCBhbmQgY29tbWVudFswXVxuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UgL1xcLXsyfVteXFxbXS4qJC8sIGNvbW1lbnRbMF1cbiAgbGluZVxuXG5ERUZBVUxUX1dBUk5fRk4gPSAobXNnKSAtPlxuICBjb25zb2xlLmxvZygnV0FSTklORzonLCBtc2cpXG5cbm1vZHVsZS5leHBvcnRzID0gKHN0ciwgaW5kZW50LCB3YXJuX2ZuLCBvcHRzID0ge30pIC0+XG4gIGVvbCA9IG9wdHM/LmVvbCBvciAnXFxuJ1xuICBpbmRlbnQgPSBpbmRlbnQgb3IgREVGQVVMVF9JTkRFTlRcbiAgd2Fybl9mbiA9IGlmIHR5cGVvZiB3YXJuX2ZuID09ICdmdW5jdGlvbicgdGhlbiB3YXJuX2ZuIGVsc2UgREVGQVVMVF9XQVJOX0ZOXG4gIGluZGVudCA9ICcgJy5yZXBlYXQoaW5kZW50KSBpZiBOdW1iZXIuaXNJbnRlZ2VyKGluZGVudClcbiAgJGN1cnJJbmRlbnQgPSAwXG4gICRuZXh0SW5kZW50ID0gMFxuICAkcHJldkxlbmd0aCA9IDBcbiAgJGV4dEluZGVudCA9IDBcbiAgJGxhc3RJbmRlbnQgPSAwXG4gICR0ZW1wbGF0ZSA9IDBcbiAgbmV3X2NvZGUgPSBzdHIuc3BsaXQoL1xccj9cXG4vZykubWFwIChsaW5lLCBsaW5lX251bWJlcikgLT5cbiAgICAkdGVtcGxhdGVfZmxhZyA9IGZhbHNlXG4gICAgaWYgJHRlbXBsYXRlXG4gICAgICByZXMyID0gbGluZS5tYXRjaCgvXFxdKD0qKVxcXS8pXG4gICAgICBpZiByZXMyIGFuZCAkdGVtcGxhdGUgPT0gcmVzMlsxXS5sZW5ndGggKyAxXG4gICAgICAgICR0ZW1wbGF0ZV9mbGFnID0gdHJ1ZVxuICAgICAgICBpZiAkdGVtcGxhdGUgYW5kICEvXT0qXSQvLnRlc3QobGluZSlcbiAgICAgICAgICBhcnIgPSBsaW5lLnNwbGl0KC9cXF09KlxcXS8sIDIpXG4gICAgICAgICAgY29tbWVudCA9IGFyclswXVxuICAgICAgICAgIGNvZGUgPSBhcnJbMV1cbiAgICAgICAgICBsaW5lID0gY29tbWVudCArICddJyArICc9Jy5yZXBlYXQoJHRlbXBsYXRlIC0gMSkgKyAnXScgKyBhZGp1c3Rfc3BhY2UoY29kZSlcbiAgICAgICAgICAkdGVtcGxhdGUgPSAwXG4gICAgICAgICR0ZW1wbGF0ZSA9IDBcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGxpbmVcbiAgICByZXMxID0gbGluZS5tYXRjaCgvXFxbKD0qKVxcWy8pXG4gICAgaWYgcmVzMVxuICAgICAgJHRlbXBsYXRlID0gcmVzMVsxXS5sZW5ndGggKyAxXG4gICAgaWYgISR0ZW1wbGF0ZV9mbGFnXG4gICAgICBsaW5lID0gbGluZS50cmltKClcbiAgICAgICMgcmVtb3RlIGFsbCBzcGFjZXMgb24gYm90aCBlbmRzXG4gICAgICBsaW5lID0gYWRqdXN0X3NwYWNlKGxpbmUpXG4gICAgaWYgIWxpbmUubGVuZ3RoXG4gICAgICByZXR1cm4gJydcbiAgICByYXdfbGluZSA9IGxpbmVcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC8oWydcIl0pW15cXDFdKj9cXDEvLCAnJylcbiAgICAjIHJlbW92ZSBhbGwgcXVvdGVkIGZyYWdtZW50cyBmb3IgcHJvcGVyIGJyYWNrZXQgcHJvY2Vzc2luZ1xuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xccyotLS4rLywgJycpXG4gICAgIyByZW1vdmUgYWxsIGNvbW1lbnRzOyB0aGlzIGlnbm9yZXMgbG9uZyBicmFja2V0IHN0eWxlIGNvbW1lbnRzXG4gICAgaWYgL14oKGxvY2FsICk/ZnVuY3Rpb258cmVwZWF0fHdoaWxlKVxcYi8udGVzdChsaW5lKSBhbmQgIS9cXGJlbmRcXHMqW1xcKSw7XSokLy50ZXN0KGxpbmUpIG9yIC9cXGIodGhlbnxkbykkLy50ZXN0KGxpbmUpIGFuZCAhL15lbHNlaWZcXGIvLnRlc3QobGluZSkgb3IgL15pZlxcYi8udGVzdChsaW5lKSBhbmQgL1xcYnRoZW5cXGIvLnRlc3QobGluZSkgYW5kICEvXFxiZW5kJC8udGVzdChsaW5lKSBvciAvXFxiZnVuY3Rpb24gPyg/OlxcdysgKT9cXChbXlxcKV0qXFwpJC8udGVzdChsaW5lKSBhbmQgIS9cXGJlbmQkLy50ZXN0KGxpbmUpXG4gICAgICAkbmV4dEluZGVudCA9ICRjdXJySW5kZW50ICsgMVxuICAgIGVsc2UgaWYgL151bnRpbFxcYi8udGVzdChsaW5lKSBvciAvXmVuZFxccypbXFwpLDtdKiQvLnRlc3QobGluZSkgb3IgL15lbmRcXHMqXFwpXFxzKlxcLlxcLi8udGVzdChsaW5lKSBvciAvXmVsc2UoaWYpP1xcYi8udGVzdChsaW5lKSBhbmQgL1xcYmVuZCQvLnRlc3QobGluZSlcbiAgICAgICRuZXh0SW5kZW50ID0gLS0kY3VyckluZGVudFxuICAgIGVsc2UgaWYgL15lbHNlXFxiLy50ZXN0KGxpbmUpIG9yIC9eZWxzZWlmXFxiLy50ZXN0KGxpbmUpXG4gICAgICAkbmV4dEluZGVudCA9ICRjdXJySW5kZW50XG4gICAgICAkY3VyckluZGVudCA9ICRjdXJySW5kZW50IC0gMVxuICAgICRicmFja2V0cyA9IChsaW5lLm1hdGNoKC9cXCgvZykgb3IgW10pLmxlbmd0aCAtICgobGluZS5tYXRjaCgvXFwpL2cpIG9yIFtdKS5sZW5ndGgpXG4gICAgIyBjYXB0dXJlIHVuYmFsYW5jZWQgYnJhY2tldHNcbiAgICAkY3VybHkgPSAobGluZS5tYXRjaCgvXFx7L2cpIG9yIFtdKS5sZW5ndGggLSAoKGxpbmUubWF0Y2goL1xcfS9nKSBvciBbXSkubGVuZ3RoKVxuICAgICMgY2FwdHVyZSB1bmJhbGFuY2VkIGN1cmx5IGJyYWNrZXRzXG4gICAgIyBjbG9zZSAoY3VybHkpIGJyYWNrZXRzIGlmIG5lZWRlZFxuICAgIGlmICRjdXJseSA8IDBcbiAgICAgICRjdXJySW5kZW50ICs9ICRjdXJseVxuICAgIGlmICRicmFja2V0cyA8IDBcbiAgICAgICRjdXJySW5kZW50ICs9ICRicmFja2V0c1xuICAgICRuZXh0SW5kZW50ICs9ICRicmFja2V0cyArICRjdXJseVxuICAgICMgY29uc29sZS5sb2coe2xhc3Q6ICRsYXN0SW5kZW50LCBjdXJyOiAkY3VyckluZGVudCwgbmV4dDogJG5leHRJbmRlbnQsIGV4dDogJGV4dEluZGVudH0pXG4gICAgaWYgJGN1cnJJbmRlbnQgLSAkbGFzdEluZGVudCA+IDFcbiAgICAgICRleHRJbmRlbnQgKz0gJG5leHRJbmRlbnQgLSAkbGFzdEluZGVudCAtIDFcbiAgICAgICRuZXh0SW5kZW50ID0gJGN1cnJJbmRlbnQgPSAxICsgJGxhc3RJbmRlbnRcbiAgICBpZiAkY3VyckluZGVudCAtICRsYXN0SW5kZW50IDwgLTEgYW5kICRleHRJbmRlbnQgPiAwXG4gICAgICAkZXh0SW5kZW50ICs9ICRjdXJySW5kZW50IC0gJGxhc3RJbmRlbnQgKyAxXG4gICAgICAkY3VyckluZGVudCA9IC0xICsgJGxhc3RJbmRlbnRcbiAgICBpZiAkbmV4dEluZGVudCA8ICRjdXJySW5kZW50XG4gICAgICAkbmV4dEluZGVudCA9ICRjdXJySW5kZW50XG4gICAgIyBjb25zb2xlLmxvZyh7bGFzdDogJGxhc3RJbmRlbnQsIGN1cnI6ICRjdXJySW5kZW50LCBuZXh0OiAkbmV4dEluZGVudCwgZXh0OiAkZXh0SW5kZW50fSlcbiAgICB3YXJuX2ZuIFwiXCJcIm5lZ2F0aXZlIGluZGVudGF0aW9uIGF0IGxpbmUgI3tsaW5lX251bWJlcn06ICN7cmF3X2xpbmV9XCJcIlwiIGlmICRjdXJySW5kZW50IDwgMFxuICAgIG5ld19saW5lID0gKGlmIHJhd19saW5lLmxlbmd0aCBhbmQgJGN1cnJJbmRlbnQgPiAwIGFuZCAhJHRlbXBsYXRlX2ZsYWcgdGhlbiBpbmRlbnQucmVwZWF0KCRjdXJySW5kZW50KSBlbHNlICcnKSArIHJhd19saW5lXG4gICAgJHVzZWZ1bCA9ICRwcmV2TGVuZ3RoID4gMCBvciByYXdfbGluZS5sZW5ndGggPiAwXG4gICAgJGxhc3RJbmRlbnQgPSAkY3VyckluZGVudFxuICAgICRjdXJySW5kZW50ID0gJG5leHRJbmRlbnRcbiAgICAkcHJldkxlbmd0aCA9IHJhd19saW5lLmxlbmd0aFxuICAgIG5ld19saW5lIG9yIHVuZGVmaW5lZFxuXG4gIHdhcm5fZm4gJ3Bvc2l0aXZlIGluZGVudGF0aW9uIGF0IHRoZSBlbmQnIGlmICRjdXJySW5kZW50ID4gMFxuICBuZXdfY29kZS5qb2luIGVvbFxuIl19

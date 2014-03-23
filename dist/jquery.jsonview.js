var JSONFormatter;

JSONFormatter = (function() {
  function JSONFormatter() {}

  JSONFormatter.prototype.htmlEncode = function(html) {
    if (html !== null) {
      return html.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    } else {
      return '';
    }
  };

  JSONFormatter.prototype.jsString = function(s) {
    s = JSON.stringify(s).slice(1, -1);
    return this.htmlEncode(s);
  };

  JSONFormatter.prototype.decorateWithSpan = function(value, className) {
    return "<span class=\"" + className + "\">" + (this.htmlEncode(value)) + "</span>";
  };

  JSONFormatter.prototype.valueToHTML = function(value) {
    var valueType;
    valueType = Object.prototype.toString.call(value).match(/\s(.+)]/)[1].toLowerCase();
    return this["" + valueType + "ToHTML"].call(this, value);
  };

  JSONFormatter.prototype.nullToHTML = function(value) {
    return this.decorateWithSpan('null', 'null');
  };

  JSONFormatter.prototype.numberToHTML = function(value) {
    return this.decorateWithSpan(value, 'num');
  };

  JSONFormatter.prototype.stringToHTML = function(value) {
    if (/^(http|https|file):\/\/[^\s]+$/i.test(value)) {
      return "<a href=\"" + (this.htmlEncode(value)) + "\"><span class=\"q\">\"</span>" + (this.jsString(value)) + "<span class=\"q\">\"</span></a>";
    } else {
      return "<span class=\"string\">\"" + (this.jsString(value)) + "\"</span>";
    }
  };

  JSONFormatter.prototype.booleanToHTML = function(value) {
    return this.decorateWithSpan(value, 'bool');
  };

  JSONFormatter.prototype.arrayToHTML = function(array) {
    var hasContents, numProps, output, value, _i, _len;
    hasContents = false;
    output = '';
    numProps = array.length;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      value = array[_i];
      hasContents = true;
      output += '<li>' + this.valueToHTML(value);
      if (numProps > 1) {
        output += ',';
      }
      output += '</li>';
      numProps--;
    }
    if (hasContents) {
      return "<span class=\"collapser\"></span>[<ul class=\"array collapsible\">" + output + "</ul>]";
    } else {
      return '[ ]';
    }
  };

  JSONFormatter.prototype.objectToHTML = function(object) {
    var hasContents, numProps, output, prop, value;
    hasContents = false;
    output = '';
    numProps = 0;
    for (prop in object) {
      numProps++;
    }
    for (prop in object) {
      value = object[prop];
      hasContents = true;
      output += "<li><span class=\"prop\"><span class=\"q\">\"</span>" + (this.jsString(prop)) + "<span class=\"q\">\"</span></span>: " + (this.valueToHTML(value));
      if (numProps > 1) {
        output += ',';
      }
      output += '</li>';
      numProps--;
    }
    if (hasContents) {
      return "<span class=\"collapser\"></span>{<ul class=\"obj collapsible\">" + output + "</ul>}";
    } else {
      return '{ }';
    }
  };

  JSONFormatter.prototype.jsonToHTML = function(json) {
    return "<div id=\"jsonview\">" + (this.valueToHTML(json)) + "</div>";
  };

  return JSONFormatter;

})();

(typeof module !== "undefined" && module !== null) && (module.exports = new JSONFormatter);

(function(jQuery) {
  return jQuery.fn.JSONView = function(json, opttions) {
    var addCollapser, collapse, defaultOptions, formatter, item, items, options, outputDoc, _i, _len, _results;
    if (opttions == null) {
      opttions = {};
    }
    defaultOptions = {
      collapsed: false
    };
    options = $.extend(defaultOptions, options);
    collapse = function(collapser) {
      var ellipsis, target;
      target = collapser.parentNode.getElementsByClassName('collapsible');
      if (!target.length) {
        return;
      }
      target = target[0];
      if (target.style.display === 'none') {
        ellipsis = target.parentNode.getElementsByClassName('ellipsis')[0];
        target.parentNode.removeChild(ellipsis);
        target.style.display = '';
        return collapser.innerHTML = '-';
      } else {
        target.style.display = 'none';
        ellipsis = document.createElement('span');
        ellipsis.className = 'ellipsis';
        ellipsis.innerHTML = ' &hellip; ';
        target.parentNode.insertBefore(ellipsis, target);
        return collapser.innerHTML = '+';
      }
    };
    addCollapser = function(item) {
      var collapser;
      if (item.nodeName !== 'LI') {
        return;
      }
      collapser = document.createElement('div');
      collapser.className = 'collapser';
      collapser.innerHTML = opttions.collapsed ? '+' : '-';
      collapser.addEventListener('click', (function(event) {
        return collapse(event.target);
      }), false);
      item.insertBefore(collapser, item.firstChild);
      if (opttions.collapsed) {
        return collapse(collapser);
      }
    };
    formatter = new JSONFormatter;
    if (Object.prototype.toString.call(json) === '[object String]') {
      json = JSON.parse(json);
    }
    outputDoc = formatter.jsonToHTML(json);
    $(this).html(outputDoc);
    items = $(this)[0].getElementsByClassName('collapsible');
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      _results.push(addCollapser(item.parentNode));
    }
    return _results;
  };
})(jQuery);

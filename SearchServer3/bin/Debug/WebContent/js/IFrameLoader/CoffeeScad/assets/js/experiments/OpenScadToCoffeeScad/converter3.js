(function() {
  var Expression, Module, Operation, Token, debug, exprs, globalparamsmatcher, index, letter, limiters, modulematcher, name, op, ops, opsmatcher, paramsmatcher, rootMatcher, spliterIndex, startIndex, text, value, _i, _len,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  text = "servo_mount_hole_dia=3; xtra=0.1; servo_mount_hole_radius=servo_mount_hole_dia/2; module ada_servo_driver(pos=[0,0,0],rot=[0,0,0]) { width=25.4; length=62.5; height=3; translate(pos) rotate(rot) { difference() { translate([0,0,height/2]) cube([width,length,height],center=true); cylinder(r=servo_mount_hole_dia/2, h=height+xtra); } } } module cubeWith_hole(COLOR=[0.1,0,1]) { color(COLOR) difference() { cube([10,10,10]); cylinder(r=1, h=10+xtra); } } module withSubmodule() { module _subModule() { cylinder(r=1, h=10+xtra); } difference() { cube([10,10,10]); _subModule(); } }";

  debug = false;

  paramsmatcher = function(text) {
    var ParamName, ParamValue, key, match, params, pattern, val;
    params = {};
    pattern = new RegExp(/([\w]+)=([\w\//:'%~+#-.*]+|\[(.*?)\])?(?=,|;|$)/g);
    match = pattern.exec(text);
    while (match) {
      ParamName = match[1];
      ParamValue = match[2];
      params[ParamName] = ParamValue;
      match = pattern.exec(text);
    }
    if (debug) {
      for (key in params) {
        val = params[key];
        console.log("pouet" + key + " " + val);
      }
    }
    return params;
  };

  globalparamsmatcher = function(text, parent) {
    var ParamName, ParamValue, expr, match, pattern, _results;
    if (parent == null) {
      parent = null;
    }
    pattern = new RegExp(/(.*?)(?=module)/);
    text = pattern.exec(text)[1];
    pattern = new RegExp(/([\w]+)=([\w\//:'%~+#-.*]+|\[(.*?)\])?(?=,|;|$)/g);
    match = pattern.exec(text);
    _results = [];
    while (match) {
      ParamName = match[1];
      ParamValue = match[2];
      if (parent != null) {
        expr = new Expression(ParamName, ParamValue, parent);
        parent.children.push(expr);
      }
      _results.push(match = pattern.exec(text));
    }
    return _results;
  };

  modulematcher = function(text, parent) {
    var match, module, moduleContent, moduleName, moduleParams, params, pattern, _results;
    if (parent == null) {
      parent = null;
    }
    pattern = new RegExp(/module\s??([\w]+)\s??\((.*?)\)(\{.*?\})/g);
    match = pattern.exec(text);
    _results = [];
    while (match) {
      moduleName = match[1];
      moduleParams = match[2];
      moduleContent = match[3];
      if (debug) {
        console.log("Match: " + match);
        console.log("ModuleName: " + moduleName + ", ModuleParams: " + moduleParams);
      }
      console.log("ModuleContent" + moduleContent);
      params = paramsmatcher(moduleParams);
      if (parent != null) {
        module = new Module(moduleName, params, parent);
        parent.children.push(module);
      }
      _results.push(match = pattern.exec(text));
    }
    return _results;
  };

  opsmatcher = function(text, parent) {
    var match, op, pattern, _results;
    if (parent == null) {
      parent = null;
    }
    pattern = new RegExp(/module\s??([\w]+)\s??\((.*?)\)\{(.*?)\}/g);
    match = pattern.exec(text);
    _results = [];
    while (match) {
      console.log("Match: " + match);
      if (parent != null) {
        op = new Operation(type, params, parent);
        parent.children.push(module);
      }
      _results.push(match = pattern.exec(text));
    }
    return _results;
  };

  rootMatcher = function(text) {
    var root;
    root = new Token();
    globalparamsmatcher(text, root);
    modulematcher(text, root);
    return root.print();
  };

  Token = (function() {
    function Token(parent, children) {
      this.parent = parent != null ? parent : null;
      this.children = children != null ? children : [];
    }

    Token.prototype.print = function() {
      var child, _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.print());
      }
      return _results;
    };

    Token.prototype.write = function() {
      var child, result, _i, _len, _ref;
      result = "";
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        result += child.write() + "\n";
      }
      return result;
    };

    return Token;

  })();

  Expression = (function(_super) {
    " For expressions like name=value: handles float, int, array, string types of values";
    __extends(Expression, _super);

    function Expression(name, value, parent, children) {
      this.name = name;
      this.value = value;
      if (children == null) {
        children = [];
      }
      Expression.__super__.constructor.call(this, parent, null);
    }

    Expression.prototype.print = function() {
      return console.log("Expr : __Name__: " + this.name + ", __Value__: " + this.value + "\n");
    };

    Expression.prototype.write = function() {
      var result;
      result = "" + this.name + "=" + this.value;
      return result;
    };

    return Expression;

  })(Token);

  Operation = (function(_super) {
    __extends(Operation, _super);

    function Operation() {
      return Operation.__super__.constructor.apply(this, arguments);
    }

    return Operation;

  })(Token);

  Module = (function(_super) {
    __extends(Module, _super);

    function Module(name, params, parent, children) {
      this.name = name;
      this.params = params != null ? params : [];
      if (children == null) {
        children = [];
      }
      Module.__super__.constructor.call(this, parent, children);
    }

    Module.prototype.print = function() {
      var child, key, output, val, _i, _len, _ref, _ref1, _results;
      output = "Module name: " + this.name + ", params: \n";
      _ref = this.params;
      for (key in _ref) {
        val = _ref[key];
        output += "   __Name__: " + key + ", __Value__: " + val + "\n";
      }
      output += "   -->\n";
      console.log(output);
      _ref1 = this.children;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        _results.push(child.print());
      }
      return _results;
    };

    Module.prototype.write = function() {
      var child, key, params_data, result, tmp, val, _i, _len, _ref, _ref1;
      params_data = "";
      tmp = [];
      _ref = this.params;
      for (key in _ref) {
        val = _ref[key];
        tmp.push("@" + key + "=" + val);
      }
      params_data = tmp.join(",");
      result = "class " + this.name + "\n constructor: (" + params_data + ")->";
      _ref1 = this.children;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        result += child.write();
      }
      return result;
    };

    return Module;

  })(Token);

  ops = ['=', '!=', '+=', '/=', '*=', '+', '-', '%', '/', '*'];

  limiters = [';', ','];

  text = "servo_mount_hole_dia=3; xtra=0.1; xtra2+=0.1; servo_mount_hole_radius=servo_mount_hole_dia/2;tutu=21.7;";

  op = null;

  name = null;

  value = null;

  exprs = [];

  spliterIndex = -1;

  startIndex = 0;

  for (index = _i = 0, _len = text.length; _i < _len; index = ++_i) {
    letter = text[index];
    if (__indexOf.call(ops, letter) >= 0 && op === null) {
      console.log(letter);
      if (name === null) {
        name = text.slice(startIndex, +(index - 1) + 1 || 9e9);
      }
      if (op !== null) {
        op += letter;
      } else {
        op = letter;
      }
      spliterIndex = index + 1;
    } else if (__indexOf.call(limiters, letter) >= 0) {
      value = text.slice(spliterIndex, +(index - 1) + 1 || 9e9);
      startIndex = index + 1;
      console.log("__Name__: " + name + ", __op__: " + op + ", __Value__: " + value);
      exprs.push("" + name + op + value);
      value = name = op = null;
    }
  }

  console.log(exprs);

}).call(this);

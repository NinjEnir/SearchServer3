(function() {
  var ModuleMatcher, Token, debug, modMatcher, output_string, test_string;

  output_string = "";


  /*test_string = "abcdef;abcf;module bubu(){a=14;} c+=13.2; d-=12;
  module ada_servo_driver(pos=[0,0,0],rot=[0,0,0]){
    width=25.4;
    length=62.5;
    height=3;
    translate(pos) rotate(rot)
    {
      translate([0,0,height/2]) cube([width,length,height],center=true);
    }}
  module toto(pos){}
  module other(name='bli'){}
  module kpla(val=17.2, emire_dia=10, emire_height=7){cylinder(r=emire_dia/2, h=emire_height);}
  "
   */

  test_string = "module kpla(val=17.2, emire_dia=10, emire_height=7,name='bli',pos=[0,0,0],color=BLACK){cylinder(r=emire_dia/2, h=emire_height);cube([10,10,10],center=true);}";

  debug = true;

  Token = (function() {
    function Token() {
      this.children = [];
      this.parent = null;
    }

    return Token;

  })();

  ModuleMatcher = (function() {
    ModuleMatcher.prototype.main_pattern = /(?:module(.*?)\((.*?)??\)\{.*?\})/g;

    ModuleMatcher.prototype.components_pattern = /(?:module(.*?)\((.*?)??\)\{(.*?)??\})/;

    ModuleMatcher.prototype.expr_pattern = /([\w]+)[\=\+\-\*\/\%]+([\w.-]+)(?=;)/g;

    ModuleMatcher.prototype.params_pattern = /([\w]+=?(([\w.-]+)?|(\[(.*?)??\])?)?)/g;

    ModuleMatcher.prototype.ops_pattern = /(translate|rotate|scale|mirror|color)\{?([\w.-]+)?\}?/g;

    ModuleMatcher.prototype.shapes_pattern = /(cube|cylinder|sphere)(?:\()(?:.*?)(?:\));/g;

    ModuleMatcher.prototype.shapes_pattern2 = /(cube|cylinder|sphere)(?:\()(.*?)(?:\));/;

    ModuleMatcher.prototype.cylinder_pattern = /r=(.*)+h=(.*[^,])+/;

    function ModuleMatcher() {
      this.modules = [];
    }

    ModuleMatcher.prototype.parse = function(src) {
      var className, classStr, content, contentStr, ctnt, cyl_params, empty, error, exprmatches, match, matches, opsmatches, opsshapes, param, params, paramsStr, renderstr, shapeData, shape_params, shape_type, shapesmatches, submatch, submatches, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _results;
      matches = src.match(this.main_pattern);
      _results = [];
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        submatches = match.match(this.components_pattern);
        className = submatches[1].replace(" ", "");
        if (debug) {
          console.log("Module/class name: " + className);
          console.log("Match: " + match);
          for (_j = 0, _len1 = submatches.length; _j < _len1; _j++) {
            submatch = submatches[_j];
            console.log("   sub match: " + submatch);
          }
        }

        /*Module params */
        paramsStr = "";
        params = submatches[2];
        if (params != null) {
          params = params.match(this.params_pattern);
          params = (function() {
            var _k, _len2, _results1;
            _results1 = [];
            for (_k = 0, _len2 = params.length; _k < _len2; _k++) {
              param = params[_k];
              _results1.push('@' + param);
            }
            return _results1;
          })();
          paramsStr = params.join(',');
          if (debug) {
            console.log(" Module/class params: " + params);
            console.log(" Module params Matches " + params);
            for (_k = 0, _len2 = params.length; _k < _len2; _k++) {
              submatch = params[_k];
              console.log("     Submatch: " + submatch);
            }
          }
        }

        /*Module content */
        contentStr = "";
        content = submatches[3];
        if (content != null) {
          console.log("   Raw content " + content);
          try {
            exprmatches = content.match(this.expr_pattern);
            if (exprmatches) {
              console.log("   Content matches: " + exprmatches);
              content = (function() {
                var _l, _len3, _results1;
                _results1 = [];
                for (_l = 0, _len3 = exprmatches.length; _l < _len3; _l++) {
                  ctnt = exprmatches[_l];
                  _results1.push('' + ctnt);
                }
                return _results1;
              })();
              content = content.join("\n\t");
              content = content.replace(/,/g, "\n").replace(/\=/g, ":");
              if (debug) {
                console.log("   Content: " + content);
              }
            }
          } catch (_error) {
            error = _error;
            console.log("Error in content parsing: " + error);
          }
        }
        ({
          "else": content = ""
        });
        renderstr = "";

        /*ops and shapes */
        opsshapes = submatches[3];
        if (content != null) {
          try {
            opsmatches = opsshapes.match(this.ops_pattern);
            console.log("Ops matches " + opsmatches);
            shapesmatches = opsshapes.match(this.shapes_pattern);
            for (_l = 0, _len3 = shapesmatches.length; _l < _len3; _l++) {
              shapeData = shapesmatches[_l];
              console.log("Info: " + shapeData);
              _ref = shapeData.match(this.shapes_pattern2), empty = _ref[0], shape_type = _ref[1], shape_params = _ref[2];
              console.log("Shape type " + shape_type);
              console.log("  Shape params " + shape_params);
              if (shape_type === "cylinder") {
                cyl_params = shape_params.match(this.cylinder_pattern);
                console.log("sqd: " + cyl_params[1]);
              }
            }
          } catch (_error) {
            error = _error;
            console.log("Error in ops and shapes parsing: " + error);
          }
        }

        /*Generate output: coffeescript class */
        classStr = "class " + className + "\n\t" + content + "\n\n\tconstructor: (" + paramsStr + ") ->\n          \n\trender: =>\n\t\t result = new CSG()\n\t\t " + renderstr;
        _results.push(this.modules.push(classStr));
      }
      return _results;
    };

    ModuleMatcher.prototype.write = function() {
      return console.log(this.modules.join("\n"));
    };

    return ModuleMatcher;

  })();

  test_string = test_string.replace("\n", " ");

  console.log("Raw string " + test_string);

  modMatcher = new ModuleMatcher();

  modMatcher.parse(test_string);

  modMatcher.write();

}).call(this);

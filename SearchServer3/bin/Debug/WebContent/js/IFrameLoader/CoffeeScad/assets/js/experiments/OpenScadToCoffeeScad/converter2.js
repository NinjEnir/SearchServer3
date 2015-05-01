(function() {
  var ParamName, ParamValue, Token, match, moduleName, moduleParams, pattern, submatch, subpattern, test_string, text, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n;

  test_string = "r=emire_dia/2, h=25, thingy='bla.toto:df', stuff=12.5, otherstuff=[25.7,2,3], stuff2=tutu%7.5";

  text = "h=25, stuff=12.5";

  pattern = new RegExp(/([\w]+)=(\d*\.?\d*)?/g);

  match = pattern.exec(text);

  while (match) {
    console.log("Match: " + match);
    for (_i = 0, _len = match.length; _i < _len; _i++) {
      submatch = match[_i];
      console.log("SubMatch:" + submatch);
    }
    match = pattern.exec(text);
  }

  console.log("#########################################");

  text = "otherstuff=[25.7,2,3], stuff=12.5, h=25, u=12";

  pattern = new RegExp(/([\w]+)=(\[(.*?)\])?/g);

  match = pattern.exec(text);

  while (match) {
    console.log("Match: " + match);
    for (_j = 0, _len1 = match.length; _j < _len1; _j++) {
      submatch = match[_j];
      console.log("SubMatch:" + submatch);
    }
    match = pattern.exec(text);
  }

  console.log("#########################################");

  text = "thingy='bla.toto:df' , gruck=33";

  pattern = new RegExp(/([\w]+)=('.*')+?/g);

  match = pattern.exec(text);

  while (match) {
    console.log("Match: " + match);
    for (_k = 0, _len2 = match.length; _k < _len2; _k++) {
      submatch = match[_k];
      console.log("SubMatch:" + submatch);
    }
    match = pattern.exec(text);
  }

  console.log("#########################################");

  text = "stuff2=tutu%7.5*3/2+height-toto, r=emire_dia/2";

  pattern = new RegExp(/([\w]+)=([\w\//:'%~+#-.*]+)?/g);

  match = pattern.exec(text);

  while (match) {
    console.log("Match: " + match);
    for (_l = 0, _len3 = match.length; _l < _len3; _l++) {
      submatch = match[_l];
      console.log("SubMatch:" + submatch);
    }
    match = pattern.exec(text);
  }

  console.log("#########################################FULL##");

  text = "r=emire_dia/2, h=25, thingy='bla.toto:df', stuff=12.5, otherstuff=[25.7,2,3], stuff2=tutu%7.5*3/2+height-toto";

  pattern = new RegExp(/([\w]+)=([\w\//:'%~+#-.*]+|\[(.*?)\])?/g);

  match = pattern.exec(text);

  while (match) {
    console.log("Match: " + match);
    for (_m = 0, _len4 = match.length; _m < _len4; _m++) {
      submatch = match[_m];
      console.log("SubMatch:" + submatch);
    }
    match = pattern.exec(text);
  }

  console.log("#########################################FULL2##");

  text = "cylinder(r=emire_dia/2, h=emire_height)";

  pattern = new RegExp(/([\w]+)=([\w\//:'%~+#-.*]+|\[(.*?)\])?/g);

  match = pattern.exec(text);

  while (match) {
    console.log("Match: " + match);
    for (_n = 0, _len5 = match.length; _n < _len5; _n++) {
      submatch = match[_n];
      console.log("SubMatch:" + submatch);
    }
    match = pattern.exec(text);
  }

  console.log("#########################################FULL2##");

  text = "module kpla(val=17.2,emire_dia=10, emire_height=7,name='bli', pos=[0,0,0], color=BLACK){cylinder(r=emire_dia/2, h=emire_height);cube([10,10,10],center=true);}";

  pattern = new RegExp(/module\s??([\w]+)\s??\((.*?)\)/g);

  match = pattern.exec(text);

  while (match) {
    console.log("Match: " + match);
    moduleName = match[1];
    moduleParams = match[2];
    console.log("moduleName: " + moduleName + " moduleParams: " + moduleParams);
    subpattern = new RegExp(/([\w]+)=([\w\//:'%~+#-.*]+|\[(.*?)\])?(?=,|$)/g);
    submatch = subpattern.exec(moduleParams);
    while (submatch) {
      ParamName = submatch[1];
      ParamValue = submatch[2];
      console.log("ParamName: " + ParamName + " value: " + ParamValue);
      submatch = subpattern.exec(moduleParams);
    }
    match = pattern.exec(text);
  }

  Token = (function() {
    function Token() {
      this.params = [];
      this.children = [];
      this.parent = null;
    }

    return Token;

  })();

}).call(this);

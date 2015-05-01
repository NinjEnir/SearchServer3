(function() {
  var ada_servo_driver, cubeWith_hole, servo_mount_hole_dia, servo_mount_hole_radius, withSubmodule, xtra;

  servo_mount_hole_dia = 3;

  xtra = 0.1;

  servo_mount_hole_radius = servo_mount_hole_dia / 2;

  ada_servo_driver = (function() {
    function ada_servo_driver(pos, rot) {
      this.pos = pos != null ? pos : [0, 0, 0];
      this.rot = rot != null ? rot : [0, 0, 0];
    }

    return ada_servo_driver;

  })();

  cubeWith_hole = (function() {
    function cubeWith_hole(COLOR) {
      this.COLOR = COLOR != null ? COLOR : [0.1, 0, 1];
    }

    return cubeWith_hole;

  })();

  withSubmodule = (function() {
    function withSubmodule() {}

    return withSubmodule;

  })();

}).call(this);
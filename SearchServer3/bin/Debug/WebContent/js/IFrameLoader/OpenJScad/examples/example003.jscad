// title: Example 003
// author: OpenSCAD.org
// description: example001.scad ported to OpenJSCAD.org

function example003() {
	return difference(
		union(
			cube({size: [30, 30, 30], center: true}),
			cube({size: [40, 15, 15], center: true}),
			cube({size: [15, 40, 15], center: true}),
			cube({size: [15, 15, 40], center: true})
		),
		union(
			cube({size: [50, 10, 10], center: true}),
			cube({size: [10, 50, 10], center: true}),
			cube({size: [10, 10, 50], center: true})
		)
	);
}

function main() {
   return example003();
}

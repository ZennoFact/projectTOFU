// モジュール化
var tofu = (function() {
	var geometry = new THREE.BoxGeometry(12, 12, 12);
	var material = new THREE.MeshPhongMaterial({color: 0xffffff});
	var fonts = [];
	var cubes = [];

	var createChar = function (font) {
		console.log(font);
		if (64 < font.keyCode && font.keyCode < 91) {
			fonts.push(font);
			font.positions.forEach ( position => {
				var cube = new THREE.Mesh(geometry, material);
				cubes.push( cube );
		    cube.position.set(position[0], position[1], position[2]);
				scene.add(cube);
			});
		}
		console.log(scene.children.length);
	};

	var deleteChar = function () {
		if (0 < fonts.length) {
			var delFont = fonts[fonts.length - 1];
			for (var i = 0; i < delFont.positions.length; i++ ) {
				scene.remove(cubes.pop())
			}
			fonts.pop();
		}
	};

	var animation = function () {
		cubes.forEach(elem => {
			elem.rotation.x += 0.01;
			elem.rotation.y += 0.01;
		});
	};

	return {
		createChar: createChar,
		deleteChar: deleteChar,
		animation: animation
	};
})();

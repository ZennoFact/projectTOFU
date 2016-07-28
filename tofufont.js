// モジュール化
var tofu = (function() {
	var geometry = new THREE.BoxGeometry(12, 12, 12);
	var miniGeometry = new THREE.BoxGeometry(6, 6, 6);
	var material = new THREE.MeshPhongMaterial({color: 0xffffff});
	var rotation = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	}
	var fonts = [];
	var cubes = [];
	var miniCubes = [];

	var MiniCube = function(type) {
		this.cube = new THREE.Mesh(miniGeometry, material);
		this.vector = [0, 0, 0];
		this.step = 20;
		switch (type) {
			case 0:
				this.vector = [1, 1, 1];
				break;
			case 1:
				this.vector = [1, -1, 1];
				break;
			case 2:
				this.vector = [-1, 1, 1];
				break;
			case 3:
				this.vector = [-1, -1, 1];
				break;
			case 4:
				this.vector = [1, 1, -1];
				break;
			case 5:
				this.vector = [1, -1, -1];
				break;
			case 6:
				this.vector = [-1, 1, -1];
				break;
			case 7:
				this.vector = [-1, -1, -1];
				break;
			default:
				console.log('Error: Illigal argument.');
				break;
		}
	};
	MiniCube.prototype.move = function () {
		this.cube.position.x += this.vector[0];
		this.cube.position.y += this.vector[1];
		this.cube.position.z += this.vector[2];

		this.step--;
		if(this.step <= 0){
			scene.remove(this.cube);
		}
	};

	var refreshMiniCube = function () {
		var newArray = miniCubes.filter(elem => {
			return (0 < elem.step);
		});
		miniCubes = newArray;
	};

	var createChar = function (font) {
		if (64 < font.keyCode && font.keyCode < 91) {
			font.positions.forEach ( position => {
				var cube = new THREE.Mesh(geometry, material);
				cubes.push( cube );
				var posX = position[0] + fonts.length * 90;
		    cube.position.set(posX, position[1], position[2]);
				scene.add(cube);
			});
			fonts.push(font);
		}
	};

	var deleteChar = function () {
		if (0 < fonts.length) {
			var delFont = fonts[fonts.length - 1];
			for (var i = 0; i < delFont.positions.length; i++ ) {
				var cube = cubes.pop();
				for (var j = 0; j < 8; j++) {
					var mc = new MiniCube(j);
					mc.cube.position.set(cube.position.x + mc.vector[0] * 6, cube.position.y + mc.vector[1] * 6, cube.position.z + mc.vector[2] * 6);
					miniCubes.push(mc);
					scene.add(mc.cube);
				}
				scene.remove(cube);
			}
			fonts.pop();
		}
	};

	var animation = function () {
		rotation.x += 0.01;
		rotation.y += 0.01;
		cubes.forEach(elem => {
			elem.rotation.x = rotation.x;
			elem.rotation.y = rotation.y;
		});
		miniCubes.forEach(elem => {
			elem.move();
		});
		refreshMiniCube();
	};

	return {
		createChar: createChar,
		deleteChar: deleteChar,
		animation: animation,
	};
})();

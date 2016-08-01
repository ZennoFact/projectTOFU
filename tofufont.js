// モジュール化
var tofu = (function() {
	var miniSide = 7;	//　かけらの一片の長さ
	var cubeGeometry = new THREE.BoxGeometry(12, 12, 12);
	var miniGeometry = new THREE.BoxGeometry(miniSide, miniSide, miniSide);
	var material = new THREE.MeshLambertMaterial({color: 0xffffff});
	var miniMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({color: 0xffffff}), 1, 1.0);
	var rotation = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	}
	var fonts = [];
	var cubes = [];
	var miniCubes = [];
	var worldRange; // 衝突したらｍｉｎｉＣｕｂｅが消えるオブジェクトの半径を設定

	var minisVector = [
		[0.2, 0.2, 0.2],
		[0.2, -0.2, 0.2],
		[-0.2, 0.2, 0.2],
		[-0.2, -0.2, 0.2],
		[0.2, 0.2, -0.2],
		[0.2, -0.2, -0.2],
		[-0.2, 0.2, -0.2],
		[-0.2, -0.2, -0.2]
	];

	var MiniCube = function(type) {
		// this.cube = new THREE.Mesh(miniGeometry, material);
		this.cube = new Physijs.BoxMesh(miniGeometry, miniMaterial, 1);
		// this.collisions = 0;
		// this.cube.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
		// 	if (other_object === reverseEarth) console.log('collision!');
		// });
		this.vector = minisVector[type];
		this.step = 180;
		this.life = true;
	};
	MiniCube.prototype.move = function () {
		// 少しでも処理を減らすためpowとsqrtの使用をやめる
		var distance　= (0 - this.cube.position.x) * (0 - this.cube.position.x) + (0 - this.cube.position.y) * (0 - this.cube.position.y) + (0 - this.cube.position.z) * (0 - this.cube.position.z);
		if(worldRange - miniSide - miniSide <= distance){
			scene.remove(this.cube);
			this.life = false;
		}
	};

	var refreshMiniCube = function () {
		var newArray = miniCubes.filter(elem => {
			return (elem.life);
		});
		miniCubes = newArray;
	};

	var createChar = function (font) {
		if (64 < font.keyCode && font.keyCode < 91) {
			font.positions.forEach ( position => {
				var cube = new THREE.Mesh(cubeGeometry, material);
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
					mc.cube.position.set(cube.position.x + mc.vector[0] * miniSide, cube.position.y + mc.vector[1] * miniSide, cube.position.z + mc.vector[2] * miniSide);
					mc.cube.rotation.set(cube.rotation.x, cube.rotation.y, cube.rotation.z);
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
		// rotation.z += 0.01;
		cubes.forEach(elem => {
			elem.rotation.x = rotation.x;
			elem.rotation.y = rotation.y;
			// elem.rotation.z = rotation.z;
		});
		miniCubes.forEach(elem => {
			elem.move();
		});
		refreshMiniCube();
	};

	var setWorldRange = function (range) {
		worldRange = range * range; // ルートの計算をさせないため2乗して代入
	};

	return {
		createChar: createChar,
		deleteChar: deleteChar,
		animation: animation,
		setWorldRange: setWorldRange
	};
})();

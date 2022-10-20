import './style.css';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';

const cursorPosition = {
	x: 0,
	y: 0
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer({
	antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

// Create a sphere
const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(
		5,
		50,
		50
	),
	new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: {
			globeTexture: {
				value: new THREE.TextureLoader().load('planet-texture.jpeg')
			}
		}
	})
);

scene.add(sphere);

// Create atmosphere
const atmosphere = new THREE.Mesh(
	new THREE.SphereGeometry(
		5,
		50,
		50
	),
	new THREE.ShaderMaterial({
		vertexShader: atmosphereVertexShader,
		fragmentShader: atmosphereFragmentShader,
		blending: THREE.AdditiveBlending,
		side: THREE.BackSide
	})
);

atmosphere.scale.set(1.1, 1.1, 1.1);

scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
	color: 0xaaaaaa
});

const starVertices = [];
for (let i = 0 ; i < 10000 ; i++) {
	//@formatter:off
	const x = (Math.random() - 0.5) * 1500;
	const y = (Math.random() - 0.5) * 1500;
	const z = -Math.random() * 3000;
	//@formatter:on
	starVertices.push(x, y, z);
}

starGeometry.setAttribute(
	'position',
	new THREE.Float32BufferAttribute(
		starVertices,
		3
	)
);
const stars = new THREE.Points(starGeometry, starMaterial);
const starsGroup = new THREE.Group();
starsGroup.add(stars);

scene.add(starsGroup);

// Animate

let currentTime = Date.now();

const animate = () => {
	const now = Date.now();
	const delta = now - currentTime;
	currentTime = now;
	sphere.rotation.y += 0.0002 * delta;

	//@formatter:off
	starsGroup.position.z += (Math.random() * 0.007) * delta;
	starsGroup.position.x += (Math.random() * 0.007) * delta;
	starsGroup.position.y += (Math.random() * 0.004) * delta;
	//@formatter:on
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};
animate();

camera.position.z = 24;

window.addEventListener('mousemove', (event) => {
	//@formatter:off
	cursorPosition.x = (event.clientX / window.innerWidth * 2 -1);
	cursorPosition.y = (event.clientY / window.innerHeight * 2 -1);
	//@formatter:on
});
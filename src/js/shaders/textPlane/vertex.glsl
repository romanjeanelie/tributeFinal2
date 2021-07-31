uniform float time;

varying vec2 vUv;


void main() {
    vec3 newposition = position;

    newposition.z += sin(position.x * 0.15 + time)  * 0.2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );

    vUv = uv; 
}
uniform float time;

varying vec3 vNormal;

void main() {
    vec3 newposition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );

    vNormal = normal;
}
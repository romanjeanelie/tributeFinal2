uniform float uPixelRatio;

attribute float size; 

varying vec2 vUv;

void main() {
    vec3 newposition = position;

    vec4 modelPosition = modelMatrix * vec4(position, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;

      gl_PointSize = max(size, uPixelRatio * 1000.);
        // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    vUv = uv; 
}
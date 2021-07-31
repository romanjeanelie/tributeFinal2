attribute float aOpacity;
attribute float size; 

varying vec3 vPosition; 
varying float vOpacity;

uniform float uTime; 
uniform float uPixelRatio;
uniform float disperse;
uniform float scaleSize;

void main(){
    vPosition = position;

    vec3 newposition = position;

    // Disperse
    newposition.x *=  1. + (sin(position.y * 10.)  * 8.) * disperse;
    newposition.y *= 1. +  (cos(position.y * 100.)  * 6.) * disperse;
    newposition.z *= 1. + sin(position.y * .05)  * disperse;

    // Offset
    newposition.y += 300. * disperse;
    newposition.z -= 410. * disperse;

   
    vec4 modelPosition = modelMatrix * vec4(newposition, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 
    
    gl_Position = projectionPosition;

    gl_PointSize = max(size * (1. + 2. * (1. - disperse)) * scaleSize, uPixelRatio * 1000.);
        // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varying
    vOpacity = aOpacity; 
}
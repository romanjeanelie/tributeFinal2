varying float vOpacity;

uniform float uPixelRatio;

attribute float size; 
attribute float opacity; 

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;  

    gl_PointSize =  max(size, uPixelRatio * 1000.);
    // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    vOpacity = opacity;
}
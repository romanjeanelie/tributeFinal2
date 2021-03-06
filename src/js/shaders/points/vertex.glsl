uniform float time;
uniform float uPixelRatio;
uniform float squeeze;

attribute float size; 
attribute float opacity; 


void main() {
    vec3 newposition = position;

    newposition.y += sin(time  + newposition.z * 100.) * 15.;

    newposition.z -= squeeze;
    

    vec4 modelPosition = modelMatrix * vec4(newposition, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;

    gl_PointSize = max(size* (1. + squeeze * 0.2), uPixelRatio * 1000.);

        // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

}
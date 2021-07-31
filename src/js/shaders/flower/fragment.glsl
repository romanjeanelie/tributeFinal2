varying vec3 vPosition; 
varying float vOpacity;


uniform vec3 color1;
uniform vec3 color2;
uniform float uOpacity;
uniform float disperse;
uniform float changeColor;



void main(){
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = (0.05 / distanceToCenter - 0.1) * uOpacity;
 
    vec3 finalColor = mix(color1, color2, vOpacity);
    finalColor = mix(finalColor, vec3(0.8), changeColor);

    gl_FragColor = vec4(finalColor,strength * 5.);
}
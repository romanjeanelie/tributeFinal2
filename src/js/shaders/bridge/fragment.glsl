varying float vOpacity;

uniform vec3 uColor;
uniform float uOpacity;



void main(){
    vec3 color = vec3(0.);
   
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = (0.05 / distanceToCenter - 0.1) * 1.;
 
   gl_FragColor = vec4(uColor, strength*5. * vOpacity);

}
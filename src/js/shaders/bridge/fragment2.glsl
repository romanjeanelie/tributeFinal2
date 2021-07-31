uniform vec3 color1;
uniform vec3 color2;
varying float vOpacity;


void main(){
   
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = (0.05 / distanceToCenter - 0.1) * 1.;

    vec3 finalColor = mix(color1, color2, vOpacity);

    gl_FragColor = vec4(finalColor, strength*5.);
}
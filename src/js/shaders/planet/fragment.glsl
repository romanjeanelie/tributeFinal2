uniform vec3 color1;
uniform vec3 color2;
uniform float wide;
uniform float opacity;

uniform float changeColor;

varying vec2 vUv;


void main()	{
    vec3 color = vec3(0.);


    color += mix(color1 * changeColor, color2 * changeColor, 1. - vUv.x * wide);

  
    gl_FragColor = vec4(color, opacity);

}
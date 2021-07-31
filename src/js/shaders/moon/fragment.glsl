uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform float opacity;
uniform float wide;
uniform float changeColor;

varying vec2 vUv;



void main()	{
    vec3 color = vec3(0.);


    color += mix(color1, color2, 1. - vUv.x * wide);
    vec3 color2 = mix(color3, color4, 1. - vUv.x * wide);
    color = mix(color, color2, changeColor)* opacity;

  
    gl_FragColor = vec4(color, 1.);

    
}
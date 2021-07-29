uniform float time;
uniform float wide;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float changeColor;
uniform float changeColor2;
uniform float opacity;

varying vec2 vUv;
varying vec3 vNormal;


void main()	{
    vec3 color = vec3(0.);

    color = mix(uColor1, uColor2, changeColor);
    color = mix(color, uColor3, changeColor2);

    gl_FragColor = vec4(color, opacity);

    
}
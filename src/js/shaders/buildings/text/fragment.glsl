uniform float time;
uniform float opacity;
uniform vec3 uColor1; 
uniform vec3 uColor2; 

varying vec3 vNormal;



void main()	{
vec3 color = vec3(0.);

color = mix(uColor1, uColor2, vNormal.z);

gl_FragColor = vec4(color, opacity);

}
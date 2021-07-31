uniform vec3 color1;
uniform vec3 color2;
uniform float uOpacity;

varying float vOpacity; 


void main()	{

    vec3 finalColor = mix(color1, color2, vOpacity);
    gl_FragColor = vec4(finalColor, vOpacity * uOpacity);

}
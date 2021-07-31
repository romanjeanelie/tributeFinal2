
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;

uniform float isColor1;
uniform float isColor2;
uniform float isColor3;
uniform float isColor4;
uniform float isColor5;

uniform float uOpacity; 




void main()	{
    float strobe = sin(time * 190.);
    float strobeLight = mix(0.7, 1., strobe);
   
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = (0.05 / distanceToCenter - 0.1) *  strobeLight * uOpacity;
 
    vec3 result = color1 * isColor1 + color2 * isColor2 + color3 * isColor3 + color4 * isColor4 + color5 * isColor5;


    gl_FragColor = vec4(result, strength*5.);

}
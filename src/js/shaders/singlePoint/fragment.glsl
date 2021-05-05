
uniform float time;
uniform vec3 color1;
uniform float opacity; 


varying vec2 vUv;

float fill(float x, float size){
    return 1. - step(size, x);
}

void main()	{
    
    vec3 color = vec3(0.);

    float circle = length(vUv - 0.5); 
    circle = fill(circle, 0.02);
 
    color = mix(vec3(0.,0.,0.), color1, circle);
    float alpha = circle; 



    gl_FragColor = vec4(color, alpha);

}
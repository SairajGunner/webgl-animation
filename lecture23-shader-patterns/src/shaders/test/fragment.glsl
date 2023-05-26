#define PI 3.14159265358979323846

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.543123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {
    // float strength = vUv.x;
    // float strength = 1.0 - vUv.y;
    // float strength = vUv.y * 10.0;

    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.5, strength);
    
    // // Triangle Pattern
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength += mod((1.0 - vUv.y) * 10.0, 1.0);
    // strength = step(1.0, strength);

    // // Square Pattern
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // // Square Pattern 2
    // float strength = 1.0 - step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength -= step(0.8, mod(vUv.y * 10.0, 1.0));

    // Square Pattern 3
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // // strength = step(1.1, strength);

    // // Line Pattern 1
    // float strength = step(0.8, mod(vUv.y * 10.0, 1.0));
    // strength -= step(0.8, mod(vUv.x * 10.0, 1.0));

    // // L Pattern 1 - This was right outta my brain. A better way is here below
    // float strength = step(0.8, mod(vUv.y * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength -= step(0.5, mod((vUv.x + 0.05) * 10.0, 1.0));
    // strength -= step(0.5, mod((vUv.y + 0.05) * 10.0, 1.0));

    // // L Pattern 1
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    
    // float strength = barX + barY;

    // // + Pattern 1 - By ME
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod((vUv.y + 0.02) * 10.0, 1.0));
    // float barY = step(0.8, mod((vUv.x + 0.02) * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    
    // float strength = barX + barY;

    // // Gradient with centre black vertical
    // float strength = pow(vUv.x - 0.5, 2.0) * 2.0; // mine
    // // Gradient with centre black vertical
    // float strength = abs(vUv.x - 0.5); // Bruno's

    // // Cross pattern with gradient - 1
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // // Cross pattern with gradient - 2
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // // Concentric square 1
    // float strength = step(0.2, abs(vUv.x - 0.5)) + step(0.2, abs(vUv.y - 0.5));
    
    // // Concentric square 2
    // float square1 = step(0.2, abs(vUv.x - 0.5)) + step(0.2, abs(vUv.y - 0.5));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // float strength = square1 * square2;

    // // Gradient with distict ranges - x
    // float strength = floor(vUv.x * 10.0) / 10.0;
    
    // // Gradient with distict ranges - x & y
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

    // Using random shading 1
    // float strength = random(vUv);

    // // Using random shading 2
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv);

    // // Using random shading 3
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.x + vUv.y) * 10.0) / 10.0);
    // float strength = random(gridUv);

    // Shade with length of the vector
    // float strength = length(vUv);

    // Shade with length of the vector - centre
    // float strength = length(vUv - 0.5);     // My method
    // float strength = distance(vUv, vec2(0.2, 0.8));     // Bruno's method

    // // Shade with length inverse
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // Shade with length inverse sharp
    // float strength = 1.0 - (distance(vUv, vec2(0.5)) * 10.0);
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // // Shade with length inverse sharp with length
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // // Shade with length inverse sharp with length
    // vec2 lightUv = vec2(
    //     (vUv.x * 0.15) + 0.425,
    //     (vUv.y * 0.5) + 0.25
    // );
    // float strength = 0.015 / distance(lightUv, vec2(0.5));

    // // Shade with length inverse sharp with length
    // vec2 lightUvX = vec2(
    //     (vUv.x * 0.15) + 0.425,
    //     (vUv.y * 0.5) + 0.25
    // );
    // float lightX = 0.01 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(
    //     (vUv.x * 0.5) + 0.25,
    //     (vUv.y * 0.15) + 0.425
    // );
    // float lightY = 0.01 / distance(lightUvY, vec2(0.5));

    // float strength = lightX + lightY;

    // // Shade with length inverse sharp with length with rotation
    // vec2 rotatedUv = rotate(vUv, PI / 4.0, vec2(0.5));

    // vec2 lightUvX = vec2(
    //     (rotatedUv.x * 0.15) + 0.425,
    //     (rotatedUv.y * 0.5) + 0.25
    // );
    // float lightX = 0.01 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(
    //     (rotatedUv.x * 0.5) + 0.25,
    //     (rotatedUv.y * 0.15) + 0.425
    // );
    // float lightY = 0.01 / distance(lightUvY, vec2(0.5));

    // float strength = lightX + lightY;

    // Circle - Dark to the centre
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // // Circle - Dark to the centre gradient
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // // Circle
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // // Circle - with sin
    // vec2 waveUv = vec2(
    //     vUv.x,
    //     vUv.y + cos(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // // Circle - with sin
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // // Random Design
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // // Angles
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // Perlin Noise 1
    // float strength = cnoise(vUv * 10.0);

    // Perlin Noise 2
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // Perlin Noise 2
    float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
    // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    strength = clamp(strength, 0.0, 1.0);

    // color mix
    vec3 blackColor = vec3(1.0);
    vec3 uvColor = vec3(vUv, 0.5);

    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);
    
    // // b & w
    // gl_FragColor = vec4(vec3(strength), 1.0);
}
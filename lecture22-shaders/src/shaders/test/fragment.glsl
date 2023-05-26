precision mediump float;

uniform sampler2D uTexture;

varying float vRandom;
varying float vModelPositionZ;
varying vec2 vUv;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vModelPositionZ * 2.0 + 0.5;
    // gl_FragColor = vec4(vModelPositionZ + 0.5, vModelPositionZ + 0.5, vModelPositionZ + 0.5, 1.0);
    gl_FragColor = textureColor;
}
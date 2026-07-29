# Shader Concepts

This section explains the WebGL ideas behind HyperGL without pretending the library is magic. The point of the project is to learn the GPU pipeline and document the process.

## Uniforms

Website route: `/docs/shaders/uniforms`

Uniforms are values sent from JavaScript to the shader program. In HyperGL, config becomes uniforms.

Example mapping:

```ts
gl.uniform1f(program.uniforms.uSpeed, config.speed);
gl.uniform1f(program.uniforms.uIntensity, config.intensity);
gl.uniform1f(program.uniforms.uDensity, config.density);
gl.uniform1f(program.uniforms.uScale, config.scale);
gl.uniform1f(program.uniforms.uDistortion, config.distortion);
gl.uniform1f(program.uniforms.uBloom, config.bloom);
gl.uniform1f(program.uniforms.uGrain, config.grain);
```

Palette colors are converted from hex to normalized RGB:

```ts
palette: ["#dbeafe", "#8b5cf6", "#2563eb"];
```

becomes values like:

```glsl
vec3 colorA = vec3(0.8588, 0.9176, 0.9961);
vec3 colorB = vec3(0.5451, 0.3608, 0.9647);
vec3 colorC = vec3(0.1451, 0.3882, 0.9216);
```

Why uniforms are useful:

- They update without recompiling shaders.
- They make sliders and presets straightforward.
- They keep shader source stable while config changes.
- They are easy to document as an API.

## Noise

Website route: `/docs/shaders/noise`

Noise gives procedural effects their structure. HyperGL uses noise-like fields to create aurora bands, liquid warps, contour lines, particles, and glass distortions.

Conceptual pattern:

```glsl
vec2 uv = gl_FragCoord.xy / uResolution.xy;
float time = uTime * uSpeed;

float base = noise(uv * uScale + time);
float warped = noise(uv + base * uDistortion);
vec3 color = mix(uColorA, uColorB, warped);
```

Domain warping means using one field to offset another:

```glsl
vec2 warp = vec2(
  noise(uv * 2.0 + time),
  noise(uv * 2.0 - time)
);

vec2 warpedUv = uv + warp * uDistortion;
```

Effect relationships:

| Effect | Noise role |
| --- | --- |
| `aurora` | Smooth bands and drifting color fields. |
| `liquid` | Strong coordinate warping. |
| `particles` | Cell-like repeated structure. |
| `topographic` | Thresholded contour lines. |
| `glassGrid` | Subtle displacement and grid breakup. |
| `rayOrb` | Light/ring variation around pseudo-3D forms. |

## Debugging

Website route: `/docs/shaders/debugging`

Shader debugging checklist:

- Confirm the shader compiles.
- Log compile and link errors with line numbers.
- Render a simple gradient before debugging complex math.
- Visualize one value at a time as grayscale.
- Clamp values to `0.0` and `1.0` before assuming color output is wrong.
- Temporarily remove bloom, grain, and post effects.
- Test with a known config from the preset gallery.

Debug a scalar:

```glsl
float value = noise(uv * 4.0);
outColor = vec4(vec3(value), 1.0);
```

Debug coordinates:

```glsl
outColor = vec4(uv.x, uv.y, 0.0, 1.0);
```

Debug pointer input:

```glsl
float pointerDistance = distance(uv, uPointer.xy);
outColor = vec4(vec3(1.0 - smoothstep(0.0, uCursorRadius, pointerDistance)), 1.0);
```

## Pipeline Summary

The current renderer is a fullscreen fragment pipeline:

```txt
canvas element
  -> WebGL2 context
  -> fullscreen triangle/quad
  -> vertex shader
  -> fragment shader
  -> uniforms from HyperGLConfig
  -> rendered frame
  -> optional capture
```

Future research can expand this into multipass rendering:

```txt
scene pass
  -> framebuffer texture
  -> bloom pass
  -> feedback/trails pass
  -> final composite
```

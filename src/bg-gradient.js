/* Îlot React isolé : il n'existe que pour ShaderGradient, qui n'a pas de
   version vanilla. Ce module est chargé en import() dynamique par home.js,
   donc React, three et R3F ne pèsent pas sur le rendu initial de la page. */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

const CANVAS_STYLE = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
};

// Réglages fournis par le brief, repris tels quels.
const GRADIENT = {
  animate: 'on',
  axesHelper: 'off',
  bgColor1: '#000000',
  bgColor2: '#000000',
  brightness: 1.5,
  cAzimuthAngle: 250,
  cDistance: 1.5,
  cPolarAngle: 140,
  cameraZoom: 12.49,
  color1: '#16324F',
  color2: '#5F8DFF',
  color3: '#46E4FF',
  destination: 'onCanvas',
  embedMode: 'off',
  envPreset: 'city',
  format: 'gif',
  fov: 45,
  frameRate: 10,
  gizmoHelper: 'hide',
  grain: 'on',
  lightType: '3d',
  pixelDensity: 1,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  range: 'disabled',
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.5,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 140,
  shader: 'defaults',
  type: 'sphere',
  uAmplitude: 7,
  uDensity: 0.8,
  uFrequency: 5.5,
  uSpeed: 0.3,
  uStrength: 0.4,
  uTime: 0,
  wireframe: false,
};

export const mountBackgroundGradient = (host) => {
  const root = createRoot(host);
  root.render(
    createElement(
      ShaderGradientCanvas,
      { style: CANVAS_STYLE, pixelDensity: 1, fov: 45 },
      createElement(ShaderGradient, GRADIENT)
    )
  );
  host.dataset.ready = '1';
  return root;
};

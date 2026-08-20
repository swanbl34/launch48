/* Îlot React isolé : il n'existe que pour ShaderGradient, qui n'a pas de
   version vanilla. Ce module est chargé en import() dynamique par home.js,
   donc React, three et R3F ne pèsent pas sur le rendu initial de la page. */
import { createElement, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useThree } from '@react-three/fiber';
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

/* Le canvas reste monté en permanence (voir lazyLoad ci-dessous), il continuerait
   donc à rendre à plein régime pendant qu'on lit le reste de la page. Ce petit
   composant, monté dans l'arbre R3F, ralentit la boucle à 5 images/seconde dès
   que le hero quitte l'écran, et la rétablit au retour.

   On ralentit, on ne met pas en pause : ShaderGradient avance son uTime sur une
   horloge murale. Une vraie pause laisserait le temps filer sans rien rendre, et
   la première image au retour rattraperait tout l'écart d'un coup — soit
   exactement le saut qu'on cherche à supprimer. En rendant lentement, l'horloge
   et l'image restent synchronisées, et le retour est invisible.              */
const IDLE_FRAME_MS = 200;

const FrameloopThrottle = ({ host }) => {
  const setFrameloop = useThree((state) => state.setFrameloop);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    // Garde-fou : sans cette API (version de R3F différente), on ne fait rien
    // et le rendu continu reste en place — le fond s'affiche correctement.
    if (typeof setFrameloop !== 'function' || !('IntersectionObserver' in window)) return;

    let timer = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        timer = null;
        if (entry.isIntersecting) {
          setFrameloop('always');
        } else {
          setFrameloop('demand');
          timer = window.setInterval(invalidate, IDLE_FRAME_MS);
        }
      },
      { threshold: 0 }
    );
    observer.observe(host);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      setFrameloop('always');
    };
  }, [host, setFrameloop, invalidate]);

  return null;
};

export const mountBackgroundGradient = (host) => {
  const root = createRoot(host);
  root.render(
    createElement(
      ShaderGradientCanvas,
      {
        style: CANVAS_STYLE,
        pixelDensity: 1,
        fov: 45,
        /* Indispensable. Par défaut ShaderGradientCanvas surveille sa propre
           visibilité avec un IntersectionObserver et démonte le canvas dès
           qu'il sort du champ. Au scroll retour vers le hero, tout était donc
           reconstruit : nouveau contexte WebGL, shaders recompilés, HDR de
           l'envPreset retéléchargé et uTime remis à zéro — d'où le dégradé qui
           « se rechargeait » brutalement avant de se stabiliser.
           On coupe ce mécanisme : le canvas est monté une seule fois et reste
           en place. Le chargement différé est déjà assuré en amont par
           l'import() dynamique de home.js, on ne perd donc rien. */
        lazyLoad: false,
      },
      /* Deux enfants : ShaderGradientCanvas les repasse tels quels au <Canvas>
         de R3F, donc React les reçoit comme un tableau — d'où les clés. */
      createElement(ShaderGradient, { key: 'gradient', ...GRADIENT }),
      createElement(FrameloopThrottle, { key: 'throttle', host })
    )
  );
  host.dataset.ready = '1';
  return root;
};

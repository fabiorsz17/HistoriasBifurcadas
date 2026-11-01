import React from 'react';
import {Composition} from 'remotion';
import {FolhaPersonagem} from './testes/FolhaPersonagem.jsx';
import {TelaEscolhaDemo} from './testes/TelaEscolhaDemo.jsx';
import {TesteCamera} from './testes/TesteCamera.jsx';

// Toda composição existe em duas versões: 1920x1080 para revisão e '<id>-1440p' (2560x1440) para o upload.
// A versão 1440p desenha o mesmo mundo escalado em 4/3, então nada precisa ser refeito para a resolução final.
const Escala1440 = ({Comp}) => (
  <div style={{width: 1920, height: 1080, transform: 'scale(1.3333333)', transformOrigin: '0 0'}}>
    <Comp />
  </div>
);

const Par = ({id, component, durationInFrames, fps = 30}) => (
  <>
    <Composition id={id} component={component} durationInFrames={durationInFrames} fps={fps} width={1920} height={1080} />
    <Composition
      id={`${id}-1440p`}
      component={Escala1440}
      defaultProps={{Comp: component}}
      durationInFrames={durationInFrames}
      fps={fps}
      width={2560}
      height={1440}
    />
  </>
);

export const RemotionRoot = () => (
  <>
    <Par id="TesteCamera" component={TesteCamera} durationInFrames={300} />
    <Par id="FolhaPersonagem" component={FolhaPersonagem} durationInFrames={1} />
    <Par id="TelaEscolhaDemo" component={TelaEscolhaDemo} durationInFrames={600} />
  </>
);

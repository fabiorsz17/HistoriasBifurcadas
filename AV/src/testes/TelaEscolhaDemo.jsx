import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TelaEscolha} from '../motor/TelaEscolha.jsx';

// Demonstração da tela de escolha com as opções do V1 da H01 (texto de trabalho, ainda sem revisão do revisor-ingles).
export const TelaEscolhaDemo = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <TelaEscolha frame={frame} textoA="Meet the woman who called" textoB="Take the bag to the police" />
    </AbsoluteFill>
  );
};

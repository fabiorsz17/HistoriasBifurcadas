import {Config} from '@remotion/cli/config';

// Usa a placa de vídeo (NVIDIA GTX 1050 Ti) no Chrome do render, em vez do desenho por software.
// Vale para `remotion render`, `remotion still` e para renders disparados pelo Studio.
Config.setChromiumOpenGlRenderer('angle');

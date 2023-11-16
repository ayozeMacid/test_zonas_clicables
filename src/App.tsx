import { FC } from 'react';

import { Canvas } from './components/canva';

import './style.css';

export const App: FC<{ name: string }> = ({ name }) => {
  return <Canvas />;
};

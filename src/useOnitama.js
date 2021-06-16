import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Game } from './onitamalib';

const useOnitama = () => {
  const [{ playMove }, setPlayMove] = useState({
    playMove: () => {},
  });
  const { enqueueSnackbar } = useSnackbar();
  const [iteration, setIteration] = useState(0);
  const [state, setState] = useState(null);
  useEffect(() => {
    const game = new Game();
    setState(game.getState());
    const newPlayMove = (move) => {
      const result = game.move(move);
      switch (result.status) {
        case 'Playing':
          setState(result);
          break;
        case 'Error':
          enqueueSnackbar(result.message, { variant: 'error' });
          break;
        case 'Finished':
          setState((current) => ({ ...current, finished: true, winner: result.winner }));
          break;
        default:
          console.log(`Unhandled Status: ${result.status}`);
          break;
      }
    };
    setPlayMove({ playMove: newPlayMove });
  }, [enqueueSnackbar, iteration]);
  const reset = () => setIteration((idx) => idx + 1);
  return { state, playMove, reset };
};

export default useOnitama;

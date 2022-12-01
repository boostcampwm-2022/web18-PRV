import { useMemo } from 'react';
import { IPaperDetail } from '../pages/PaperDetail/PaperDetail';

export default function useGraphData<T>(data: IPaperDetail) {
  const result = useMemo<T>(() => {
    const nodes = [
      { author: data.authors?.[0] || 'unknown', isSelected: true, x: 327, y: 398 },
      ...data.referenceList.map((v) => ({
        author: v.author || 'unknown',
        isSelected: false,
      })),
    ];
    const links = data.referenceList.map((v, i) => ({
      source: 0,
      target: i + 1,
    }));

    return { nodes, links } as T;
  }, [data]);
  return result;
}

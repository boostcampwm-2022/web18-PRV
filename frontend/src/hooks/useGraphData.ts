import { useMemo } from 'react';
import { IPaperDetail } from '../pages/PaperDetail/PaperDetail';

export default function useGraphData<T>(data: IPaperDetail) {
  return useMemo<T>(() => {
    const nodes = [
      { author: data.authors?.[0] || 'unknown', key: data.key, isSelected: true },
      ...data.referenceList.map((v) => ({
        author: v.authors?.[0] || 'unknown',
        key: v.key,
        isSelected: false,
      })),
    ];
    const links = data.referenceList.map((v, i) => ({
      source: 0,
      target: i + 1,
    }));

    return { nodes, links } as T;
  }, [data]);
}

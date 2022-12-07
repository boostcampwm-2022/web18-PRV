import { useEffect, useMemo, useRef, useState } from 'react';
import { IPaperDetail } from './../../pages/PaperDetail/PaperDetail';

type DoiMap = {
  [key: string]: number;
};

export default function useGraphData<T>(data: IPaperDetail) {
  const [links, setLinks] = useState<any[]>([]);
  const nodes = useRef<any[]>([]);
  const doiMap = useMemo<Map<string, number>>(() => new Map(), []);

  useEffect(() => {
    const newNodes = [
      {
        author: data.authors?.[0] || 'unknown',
        isSelected: true,
        key: data.key,
        doi: data.doi,
      },
      ...data.referenceList.map((v) => ({
        author: v.authors?.[0] || 'unknown',
        isSelected: false,
        key: v.key,
        doi: v.doi,
      })),
    ];

    newNodes.forEach((node) => {
      const foundIndex = doiMap.get(node.key);
      if (foundIndex) {
        if (foundIndex === doiMap.get(data.key)) {
          nodes.current[foundIndex].isSelected = true;
        }
        return;
      }
      nodes.current.push(node);
    });

    nodes.current.forEach((node, i) => doiMap.set(node.key, i));

    const newLinks = data.referenceList.map((reference) => ({
      source: doiMap.get(data.key),
      target: doiMap.get(reference.key),
    }));

    setLinks((prev) => [...prev, ...newLinks]);
  }, [data, doiMap]);

  return { nodes: nodes.current, links } as T;
}

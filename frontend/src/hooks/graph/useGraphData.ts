import { useEffect, useState, useRef } from 'react';
import { IPaperDetail } from './../../pages/PaperDetail/PaperDetail';

type DoiMap = {
  [key: string]: number;
};

export default function useGraphData<T>(data: IPaperDetail) {
  const [links, setLinks] = useState<any[]>([]);
  const nodes = useRef<any[]>([]);
  const doiMap = useRef<DoiMap>({});

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
      if (doiMap.current[node.key]) return;
      else nodes.current.push(node);
    });

    doiMap.current = nodes.current.reduce((prev, curr, i) => ({ ...prev, [curr.key]: i }), {});

    const newLinks = data.referenceList.map((reference) => {
      doiMap.current[reference.key];
      return { source: doiMap.current[data.key], target: doiMap.current[reference.key] };
    });

    setLinks((prev) => [...prev, ...newLinks]);
  }, [data, doiMap]);

  return { nodes: nodes.current, links } as T;
}

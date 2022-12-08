import { useEffect, useRef, useState } from 'react';
import { IPaperDetail } from './../../pages/PaperDetail/PaperDetail';

export default function useGraphData<T>(data: IPaperDetail) {
  const [links, setLinks] = useState<any[]>([]);
  const nodes = useRef<any[]>([]);
  const doiMap = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const newIndex = doiMap.current.get(data.key);
    if (newIndex !== undefined && nodes.current[newIndex].isSelected) return;

    const newNodes = [
      {
        author: data.authors?.[0] || 'unknown',
        isSelected: true,
        key: data.key,
        doi: data.doi,
        citations: data.citations,
        publishedYear: new Date(data.publishedAt).getFullYear(),
      },
      ...data.referenceList.map((v) => ({
        author: v.authors?.[0] || 'unknown',
        isSelected: false,
        key: v.key,
        doi: v.doi,
        citations: v.citations,
        publishedYear: v.publishedAt && new Date(v.publishedAt).getFullYear(),
      })),
    ];

    newNodes.forEach((node) => {
      const foundIndex = doiMap.current.get(node.key);
      if (foundIndex !== undefined) {
        if (foundIndex === newIndex) {
          nodes.current[foundIndex].isSelected = true;
        }
        return;
      }
      nodes.current.push(node);
    });

    nodes.current.forEach((node, i) => doiMap.current.set(node.key, i));

    const newLinks = data.referenceList.map((reference) => ({
      source: data.key,
      target: reference.key,
    }));
    if (newLinks.length > 0) setLinks((prev) => [...prev, ...newLinks]);
  }, [data]);

  return { nodes: nodes.current, links } as T;
}

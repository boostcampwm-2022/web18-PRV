import { IPaperDetail } from '@/api/api';
import { useEffect, useRef, useState } from 'react';

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
        key: data.key.toLowerCase(),
        doi: data.doi,
        citations: data.citations,
        publishedYear: new Date(data.publishedAt).getFullYear(),
      },
      ...data.referenceList.map((v) => ({
        author: v.authors?.[0] || 'unknown',
        isSelected: false,
        key: v.key.toLowerCase(),
        doi: v.doi,
        citations: v.citations,
        publishedYear: v.publishedAt && new Date(v.publishedAt).getFullYear(),
      })),
    ];

    newNodes.forEach((node) => {
      const foundIndex = doiMap.current.get(node.key);
      if (foundIndex === undefined) {
        nodes.current.push(node);
        return;
      }
      if (foundIndex === newIndex) {
        Object.entries(node).forEach(([k, v]) => {
          nodes.current[foundIndex][k] = v;
        });
      }
    });

    nodes.current.forEach((node, i) => doiMap.current.set(node.key, i));

    const newLinks = data.referenceList.map((reference) => ({
      source: data.key.toLowerCase(),
      target: reference.key.toLowerCase(),
    }));
    setLinks((prev) => [...prev, ...newLinks]);
  }, [data, links]);

  return { nodes: nodes.current, links } as T;
}

import { useEffect, useRef } from 'react';
import { IPaperDetail } from './../../pages/PaperDetail/PaperDetail';

export default function useGraphData<T>(data: IPaperDetail) {
  const nodes = useRef<any[]>([]);
  const links = useRef<any[]>([]);
  const doiMap = useRef<any>({});

  useEffect(() => {
    const newNodes = [
      {
        author: data.authors?.[0] || 'unknown',
        isSelected: true,
        key: data.doi,
        doi: data.doi,
        referenceList: data.referenceList.map((v) => v.key),
      },
      ...data.referenceList.map((v) => ({
        author: v.authors?.[0] || 'unknown',
        isSelected: false,
        key: v.key,
        doi: v?.doi,
        referenceList: [],
      })),
    ];
    newNodes.forEach((node) => {
      if (doiMap.current[node.key]) return;
      else nodes.current.push(node);
    });

    doiMap.current = nodes.current.reduce((prev, curr, i) => ({ ...prev, [curr.key]: i }), {});

    const newLinks = newNodes
      .map((newNode: any) =>
        newNode.referenceList.reduce(
          (prev: any[], curr: any) => [
            ...prev,
            {
              source: doiMap.current[newNode.key],
              target: doiMap.current[curr],
            },
          ],
          [],
        ),
      )
      .flat();
    links.current.push(...newLinks);
    console.log(nodes.current, links.current);
  }, [data]);

  return { nodes: nodes.current, links: links.current } as T;
}

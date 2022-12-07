import { useMemo } from 'react';
import { IPaperDetail, IReference } from './../pages/PaperDetail/PaperDetail';

export default function useGraphData<T>(data: IPaperDetail[]) {
  console.log(data);
  const getReferencesDoi = (referenceList: IReference[]) => {
    return referenceList.map((v) => v.key);
  };

  const nodes = useMemo<any[]>(
    () =>
      data.reduce(
        (prev: any[], curr: IPaperDetail) => [
          ...prev,
          {
            author: curr.authors?.[0] || 'unknown',
            isSelected: true,
            key: curr.key,
            doi: curr.doi,
            referenceList: getReferencesDoi(curr.referenceList),
          },
          ...curr.referenceList.map((v) => ({
            author: v.authors?.[0] || 'unknown',
            isSelected: false,
            key: v.key,
            doi: v?.doi,
            referenceList: [],
          })),
        ],
        [],
      ),
    [data],
  );

  const links = useMemo<any[]>(() => {
    const doiMap = nodes.reduce((prev, curr, i) => ({ ...prev, [curr.key]: i }), {});
    return nodes.reduce(
      (prev: any[], curr: any) => [
        ...prev,
        ...curr.referenceList.map((reference: string) => ({
          source: doiMap[curr.key],
          target: doiMap[reference],
        })),
      ],
      [],
    );
  }, [nodes]);

  return { nodes, links } as T;
}

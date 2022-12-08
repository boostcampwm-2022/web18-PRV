import * as d3 from 'd3';
import { useCallback } from 'react';

export default function useLinkUpdate(links: any[]) {
  return useCallback(
    (linksSelector: SVGGElement) => {
      d3.select(linksSelector)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', (d) => d.source?.x)
        .attr('y1', (d) => d.source?.y)
        .attr('x2', (d) => d.target?.x)
        .attr('y2', (d) => d.target?.y);
    },
    [links],
  );
}

import * as d3 from 'd3';
import { useEffect } from 'react';

export default function useGraphHover(nodeSelector: SVGGElement | null, nodes: any[], hoveredNode: string) {
  useEffect(() => {
    if (nodeSelector === null) return;

    if (hoveredNode === '') {
      d3.select(nodeSelector).selectAll('text').style('fill-opacity', '0.5');
    }

    d3.select(nodeSelector)
      .selectAll('text')
      .data(nodes)
      .filter((d) => d.key === hoveredNode)
      .style('fill-opacity', '1');
  }, [nodeSelector, hoveredNode, nodes]);
}

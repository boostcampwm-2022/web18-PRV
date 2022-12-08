import { useTheme } from 'styled-components';
import * as d3 from 'd3';
import { useEffect } from 'react';

export default function useGraphEmphasize(
  nodeSelector: SVGGElement | null,
  linkSelector: SVGGElement | null,
  nodes: any[],
  links: any[],
  hoveredNode: string,
  selectedKey: string,
) {
  const theme = useTheme();
  const { secondary1: emphasize, gray1: basic } = theme.COLOR;

  useEffect(() => {
    if (nodeSelector === null) return;

    if (hoveredNode === '') {
      d3.select(nodeSelector).selectAll('text').style('fill-opacity', '0.5');
    }

    // click/hover된 노드 강조
    d3.select(nodeSelector)
      .selectAll('text')
      .data(nodes)
      .filter((d) => d.key === selectedKey || d.key === hoveredNode)
      .style('fill-opacity', '1');

    // click/hover된 노드의 자식 노드들 강조
    d3.select(nodeSelector)
      .selectAll('text')
      .data(nodes)
      .filter((d) => {
        const targetList = links
          .filter((l) => l.source.key === selectedKey || l.source.key === hoveredNode)
          .map((l) => l.target.key);
        return targetList.indexOf(d.key) >= 0;
      })
      .style('fill-opacity', '1');

    // click/hover된 노드의 링크 강조
    d3.select(linkSelector)
      .selectAll('line')
      .data(links)
      .style('stroke', (d) => {
        return d.source.key === selectedKey || d.source.key === hoveredNode ? emphasize : basic;
      })
      .style('stroke-width', (d) => (d.source.key === selectedKey || d.source.key === hoveredNode ? '0.8px' : '0.5px'))
      .style('stroke-dasharray', (d) => (d.source.key === selectedKey || d.source.key === hoveredNode ? 'none' : '1'));
  }, [nodeSelector, hoveredNode, nodes, links, selectedKey, linkSelector, emphasize, basic]);
}

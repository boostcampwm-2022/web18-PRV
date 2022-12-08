import { useTheme } from 'styled-components';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export default function useGraphEmphasize(
  nodeSelector: SVGGElement | null,
  linkSelector: SVGGElement | null,
  nodes: any[],
  links: any[],
  hoveredNode: string,
  selectedKey: string,
) {
  const theme = useTheme();
  const styleConstants = useRef({
    EMPHASIZE_COLOR: theme.COLOR.secondary1,
    BASIC_COLOR: theme.COLOR.gray1,
    EMPHASIZE_OPACITY: '1',
    BASIC_OPACITY: '0.5',
    EMPHASIZE_STROKE_WIDTH: '0.8px',
    BASIC_STROKE_WIDTH: '0.5px',
    EMPHASIZE_STROKE_DASH: 'none',
    BASIC_STROKE_DASH: '1',
  });

  useEffect(() => {
    const styles = styleConstants.current;

    if (nodeSelector === null) return;

    if (hoveredNode === '') {
      d3.select(nodeSelector).selectAll('text').style('fill-opacity', styles.BASIC_OPACITY);
    }

    // click/hover된 노드 강조
    d3.select(nodeSelector)
      .selectAll('text')
      .data(nodes)
      .filter((d) => d.key === selectedKey || d.key === hoveredNode)
      .style('fill-opacity', styles.EMPHASIZE_OPACITY);

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
      .style('fill-opacity', styles.EMPHASIZE_OPACITY);

    // click/hover된 노드의 링크 강조
    d3.select(linkSelector)
      .selectAll('line')
      .data(links)
      .style('stroke', (d) => {
        return d.source.key === selectedKey || d.source.key === hoveredNode
          ? styles.EMPHASIZE_COLOR
          : styles.BASIC_COLOR;
      })
      .style('stroke-width', (d) =>
        d.source.key === selectedKey || d.source.key === hoveredNode
          ? styles.EMPHASIZE_STROKE_WIDTH
          : styles.BASIC_STROKE_WIDTH,
      )
      .style('stroke-dasharray', (d) =>
        d.source.key === selectedKey || d.source.key === hoveredNode
          ? styles.EMPHASIZE_STROKE_DASH
          : styles.BASIC_STROKE_DASH,
      );
  }, [nodeSelector, hoveredNode, nodes, links, selectedKey, linkSelector]);
}

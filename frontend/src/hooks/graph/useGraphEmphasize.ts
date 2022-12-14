import { Link, Node } from '@/pages/PaperDetail/components/ReferenceGraph';
import * as d3 from 'd3';
import { useCallback, useEffect } from 'react';
import { useTheme } from 'styled-components';

const styles = {
  EMPHASIZE_OPACITY: '1',
  BASIC_OPACITY: '0.5',
  EMPHASIZE_STROKE_WIDTH: '1.5px',
  BASIC_STROKE_WIDTH: '0.5px',
  EMPHASIZE_STROKE_DASH: 'none',
  BASIC_STROKE_DASH: '1',
};

export default function useGraphEmphasize(
  nodeSelector: SVGGElement | null,
  linkSelector: SVGGElement | null,
  nodes: Node[],
  links: Link[],
  hoveredNode: string,
  selectedKey: string,
) {
  const theme = useTheme();
  const getStyles = useCallback(
    (key: string, emphasizeStyle: string, basicStyle: string) =>
      key === selectedKey || key === hoveredNode ? emphasizeStyle : basicStyle,
    [hoveredNode, selectedKey],
  );

  useEffect(() => {
    if (nodeSelector === null) return;

    // hover된 노드 강조
    d3.select(nodeSelector)
      .selectAll('text')
      .data(nodes)
      .filter((d) => d.key === hoveredNode)
      .style('fill-opacity', styles.EMPHASIZE_OPACITY);

    // hover된 노드의 자식 노드들 강조
    d3.select(nodeSelector)
      .selectAll('text')
      .data(nodes)
      .filter((d) => {
        return links
          .filter((l) => l.source === hoveredNode)
          .map((l) => l.target)
          .includes(d.key);
      })
      .style('fill-opacity', styles.EMPHASIZE_OPACITY);
  }, [hoveredNode, links, nodeSelector, nodes, theme]);

  useEffect(() => {
    if (nodeSelector === null) return;

    // click된 노드 강조
    d3.select(nodeSelector)
      .selectAll('text')
      .data(nodes)
      .filter((d) => d.key === selectedKey)
      .style('fill', theme.COLOR.secondary2);

    // click된 노드의 자식 노드들 강조
    d3.select(nodeSelector)
      .selectAll('text')
      .data(nodes)
      .filter((d) => {
        const result = links
          .filter((l) => l.source === selectedKey)
          .map((l) => l.target)
          .includes(d.key);
        return result;
      })
      .style('fill', theme.COLOR.secondary2);

    // click/hover된 노드의 링크 강조
    d3.select(linkSelector)
      .selectAll('line')
      .data(links)
      .style('stroke', (d) => getStyles(d.source as string, theme.COLOR.secondary1, theme.COLOR.gray1))
      .style('stroke-width', (d) =>
        getStyles(d.source as string, styles.EMPHASIZE_STROKE_WIDTH, styles.BASIC_STROKE_WIDTH),
      )
      .style('stroke-dasharray', (d) =>
        getStyles(d.source as string, styles.EMPHASIZE_STROKE_DASH, styles.BASIC_STROKE_DASH),
      );

    return () => {
      d3.select(nodeSelector).selectAll('text').style('fill-opacity', styles.BASIC_OPACITY);
      d3.select(nodeSelector).selectAll('text').style('fill', theme.COLOR.offWhite);
    };
  }, [nodeSelector, nodes, links, selectedKey, linkSelector, getStyles, theme]);
}

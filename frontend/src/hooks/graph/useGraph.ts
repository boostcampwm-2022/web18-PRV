import { Link, Node } from '@/pages/PaperDetail/components/ReferenceGraph';
import theme from '@/style/theme';
import * as d3 from 'd3';
import { useCallback } from 'react';

const useGraph = (
  nodeSelector: SVGGElement | null,
  linkSelector: SVGGElement | null,
  addChildrensNodes: (doi: string) => void,
  changeHoveredNode: (doi: string) => void,
) => {
  const drawLink = useCallback(
    (links: Link[]) => {
      d3.select(linkSelector)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('x1', (d) => (d.source as Node).x || null)
        .attr('y1', (d) => (d.source as Node).y || null)
        .attr('x2', (d) => (d.target as Node).x || null)
        .attr('y2', (d) => (d.target as Node).y || null);
    },
    [linkSelector],
  );

  const drawNode = useCallback(
    (nodes: Node[]) => {
      const NORMAL_SYMBOL_SIZE = 20;
      const STAR_SYMBOL_SIZE = 100;

      const normalSymbol = d3.symbol().type(d3.symbolSquare).size(NORMAL_SYMBOL_SIZE)();
      const starSymbol = d3.symbol().type(d3.symbolStar).size(STAR_SYMBOL_SIZE)();

      const converToColor = (value: number) => {
        const loged = Math.trunc(Math.log10(value));
        return d3.scaleLinear([0, 4], ['white', theme.COLOR.secondary2]).interpolate(d3.interpolateRgb)(loged);
      };

      d3.select(nodeSelector)
        .selectAll('path')
        .data(nodes)
        .join('path')
        .attr('transform', (d) => `translate(${[d.x, d.y]})`)
        .attr('d', (d) => (d.isSelected ? starSymbol : normalSymbol))
        .attr('fill', (d) => converToColor(d.citations || 0))
        .attr('fill-opacity', (d) => (d.doi ? 1 : 0.5))
        .on('mouseover', (_, d) => d.doi && changeHoveredNode(d.key))
        .on('mouseout', () => changeHoveredNode(''))
        .on('click', (_, d) => d.doi && addChildrensNodes(d.doi));

      d3.select(nodeSelector)
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text((d) => `${d.author} ${d.publishedYear ? `(${d.publishedYear})` : ''}`)
        .attr('x', (d) => d.x || null)
        .attr('y', (d) => (d.y ? d.y + 10 : null))
        .attr('dy', 5)
        .style('font-weight', 700)
        .on('mouseover', (_, d) => d.doi && changeHoveredNode(d.key))
        .on('mouseout', () => changeHoveredNode(''))
        .on('click', (_, d) => d.doi && addChildrensNodes(d.doi));
    },
    [nodeSelector, addChildrensNodes, changeHoveredNode],
  );

  return { drawLink, drawNode };
};

export default useGraph;

import * as d3 from 'd3';
import { useCallback } from 'react';
import theme from '../../style/theme';

const NORMAL_SYMBOL_SIZE = 20;
const STAR_SYMBOL_SIZE = 100;

export default function useNodeUpdate(
  nodes: any[],
  changeHoveredNode: (key: string) => void,
  addChildrensNodes: (doi: string) => void,
) {
  return useCallback(
    (nodesSelector: SVGGElement) => {
      const normalSymbol = d3.symbol().type(d3.symbolSquare).size(NORMAL_SYMBOL_SIZE)();
      const starSymbol = d3.symbol().type(d3.symbolStar).size(STAR_SYMBOL_SIZE)();

      const converToColor = d3.scaleLog([1, 10000], ['white', theme.COLOR.secondary2]).interpolate(d3.interpolateRgb);

      d3.select(nodesSelector)
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

      d3.select(nodesSelector)
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text((d) => `${d.author} ${d.publishedYear ? `(${d.publishedYear})` : ''}`)
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y + 10)
        .attr('dy', 5)
        .on('mouseover', (_, d) => d.doi && changeHoveredNode(d.key))
        .on('mouseout', () => changeHoveredNode(''))
        .on('click', (_, d) => d.doi && addChildrensNodes(d.doi));
    },
    [nodes, addChildrensNodes, changeHoveredNode],
  );
}

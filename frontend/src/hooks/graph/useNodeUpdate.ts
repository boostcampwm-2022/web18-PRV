import * as d3 from 'd3';
import { useCallback } from 'react';

export default function useNodeUpdate(
  nodes: any[],
  changeHoveredNode: (key: string) => void,
  addChildrensNodes: (node: any) => void,
) {
  console.log('nodes', nodes);
  return useCallback(
    (nodesSelector: SVGGElement) => {
      const normalSymbol = d3.symbol().type(d3.symbolSquare).size(10)();
      const starSymbol = d3.symbol().type(d3.symbolStar).size(70)();

      d3
        .select(nodesSelector)
        .selectAll('path')
        .data(nodes)
        .join('path')
        .attr('transform', (d) => `translate(${[d.x, d.y]})`)
        .attr('d', (d) => (d.isSelected ? starSymbol : normalSymbol))
        .on('click', (_, data) => addChildrensNodes(data)),
        d3
          .select(nodesSelector)
          .selectAll('text')
          .data(nodes)
          .join('text')
          .text((d) => d.author)
          .on('mouseover', (e, d) => {
            changeHoveredNode(d.key);
          })
          .on('mouseout', () => {
            changeHoveredNode('');
          })
          .attr('x', (d) => d.x)
          .attr('y', (d) => d.y + 10)
          .attr('dy', 5);
    },
    [nodes, addChildrensNodes, changeHoveredNode],
  );
}

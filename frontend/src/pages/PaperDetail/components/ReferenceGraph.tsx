import { IPaperDetail } from '@/api/api';
import { useGraphData, useGraphEmphasize, useGraphZoom } from '@/hooks';
import theme from '@/style/theme';
import * as d3 from 'd3';
import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import InfoTooltip from './InfoTooltip';

interface ReferenceGraphProps {
  data: IPaperDetail;
  addChildrensNodes: (doi: string) => void;
  hoveredNode: string;
  changeHoveredNode: (key: string) => void;
}

let worker = new Worker(new URL('../workers/forceSimulation.worker.ts', import.meta.url));

const ReferenceGraph = ({ data, addChildrensNodes, hoveredNode, changeHoveredNode }: ReferenceGraphProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const linkRef = useRef<SVGGElement | null>(null);
  const nodeRef = useRef<SVGGElement | null>(null);
  const flag = useRef<number>(0);

  const { nodes, links } = useGraphData<{ nodes: any[]; links: any[] }>(data);

  const drawLink = useCallback((links: any[]) => {
    d3.select(linkRef.current)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', (d) => d.source?.x)
      .attr('y1', (d) => d.source?.y)
      .attr('x2', (d) => d.target?.x)
      .attr('y2', (d) => d.target?.y);
  }, []);

  const drawNode = useCallback(
    (nodes: any[]) => {
      const NORMAL_SYMBOL_SIZE = 20;
      const STAR_SYMBOL_SIZE = 100;

      const normalSymbol = d3.symbol().type(d3.symbolSquare).size(NORMAL_SYMBOL_SIZE)();
      const starSymbol = d3.symbol().type(d3.symbolStar).size(STAR_SYMBOL_SIZE)();

      const converToColor = (value: number) => {
        const loged = Math.trunc(Math.log10(value));
        return d3.scaleLinear([0, 4], ['white', theme.COLOR.secondary2]).interpolate(d3.interpolateRgb)(loged);
      };

      d3.select(nodeRef.current)
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

      d3.select(nodeRef.current)
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
    [addChildrensNodes, changeHoveredNode],
  );

  useGraphZoom(svgRef.current);
  useGraphEmphasize(nodeRef.current, linkRef.current, nodes, links, hoveredNode, data.key);

  useEffect(() => {
    if (links.length <= 0 || !svgRef.current) return;
    worker.terminate();
    worker = new Worker(new URL('../workers/forceSimulation.worker.ts', import.meta.url));
    worker.postMessage({
      nodes,
      links,
      centerX: svgRef.current?.clientWidth / 2,
      centerY: svgRef.current?.clientHeight / 2,
    });
    worker.onmessage = (event) => {
      if (event.data.type === 'stop') flag.current = 0;
      const { newNodes, newLinks } = event.data as { newNodes: any[]; newLinks: any[] };
      if (!newLinks || newLinks.length <= 0) return;
      drawLink(newLinks);
      drawNode(newNodes);
    };
  }, [nodes, links, drawLink, drawNode]);

  return (
    <Container>
      <InfoTooltip />
      <Graph ref={svgRef}>
        <Links ref={linkRef}></Links>
        <Nodes ref={nodeRef}></Nodes>
      </Graph>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.COLOR.primary4};
`;

const Graph = styled.svg`
  width: 100%;
  height: 100%;
`;

const Links = styled.g`
  line {
    stroke: ${({ theme }) => theme.COLOR.gray1};
    stroke-width: 0.5px;
    stroke-dasharray: 1;
  }

  path {
    fill: ${({ theme }) => theme.COLOR.secondary1};
  }
`;

const Nodes = styled.g`
  text {
    text-anchor: middle;
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    fill: ${({ theme }) => theme.COLOR.gray2};
    fill-opacity: 50%;
    font-size: 8px;
    cursor: default;
    :hover {
      fill-opacity: 100%;
    }
  }
`;

export default ReferenceGraph;

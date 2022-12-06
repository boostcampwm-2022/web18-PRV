import * as d3 from 'd3';
import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useGraphData from '../../../customHooks/useGraphData';
import { IPaperDetail } from '../PaperDetail';

interface ReferenceGraphProps {
  data: IPaperDetail;
  hoveredNode: string;
  changeHoveredNode: (key: string) => void;
}

const ReferenceGraph = ({ data, hoveredNode, changeHoveredNode }: ReferenceGraphProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const linkRef = useRef<SVGGElement | null>(null);
  const nodeRef = useRef<SVGGElement | null>(null);
  const { nodes, links } = useGraphData<{ nodes: any[]; links: any[] }>(data);

  const updateLinks = useCallback(
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

  const updateNodes = useCallback(
    (nodesSelector: SVGGElement) => {
      const normalSymbol = d3.symbol().type(d3.symbolSquare).size(10)();
      const starSymbol = d3.symbol().type(d3.symbolStar).size(70)();

      d3.select(nodesSelector)
        .selectAll('path')
        .data(nodes)
        .join('path')
        .attr('transform', (d) => `translate(${[d.x, d.y]})`)
        .attr('d', (d) => (d.isSelected ? starSymbol : normalSymbol));

      d3.select(nodesSelector)
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
    [nodes, changeHoveredNode],
  );

  useEffect(() => {
    const handleZoom = (e: any) => {
      d3.select(svgRef.current).selectChildren().attr('transform', e.transform);
    };

    const zoom = d3.zoom().on('zoom', handleZoom);

    d3.select(svgRef.current as Element).call(zoom);

    const ticked = (linksSelector: SVGGElement, nodesSelector: SVGGElement) => {
      updateLinks(linksSelector);
      updateNodes(nodesSelector);
    };

    d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-1500))
      .force(
        'center',
        svgRef?.current && d3.forceCenter(svgRef.current.clientWidth / 2, svgRef.current.clientHeight / 2),
      )
      .force('link', d3.forceLink().links(links))
      .on('tick', () => {
        if (!linkRef.current || !nodeRef.current) return;
        ticked(linkRef.current, nodeRef.current);
      });
  }, [nodes, links, updateLinks, updateNodes]);

  useEffect(() => {
    if (hoveredNode === '') {
      d3.select(nodeRef.current).selectAll('text').style('fill-opacity', '0.5');
    }

    d3.select(nodeRef.current)
      .selectAll('text')
      .data(nodes)
      .filter((d) => d.key === hoveredNode)
      .style('fill-opacity', '1');
  }, [hoveredNode, nodes]);

  return (
    <Container ref={containerRef}>
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
  path {
    fill: ${({ theme }) => theme.COLOR.secondary1};
  }

  text {
    text-anchor: middle;
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    fill: ${({ theme }) => theme.COLOR.gray2};
    fill-opacity: 50%;
    font-size: 12px;
    cursor: pointer;

    :hover {
      fill-opacity: 100%;
    }
  }
`;

export default ReferenceGraph;

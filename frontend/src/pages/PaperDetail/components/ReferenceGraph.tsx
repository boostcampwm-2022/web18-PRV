import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IPaperDetail } from '../PaperDetail';

interface ReferenceGraphProps {
  data: IPaperDetail;
}

const nodes: any[] = [
  { name: 'paper' },
  { name: 'r1' },
  { name: 'r2' },
  { name: 'r3' },
  { name: 'r1-1' },
  { name: 'r1-2' },
];

const links: any[] = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 0, target: 3 },
  { source: 1, target: 4 },
  { source: 1, target: 5 },
  { source: 1, target: 5 },
];

const updateLinks = (linksSelector: SVGGElement) => {
  d3.select(linksSelector)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('x1', (d) => d.source?.x)
    .attr('y1', (d) => d.source?.y)
    .attr('x2', (d) => d.target?.x)
    .attr('y2', (d) => d.target?.y);
};

const symbolGenerator = d3.symbol().type(d3.symbolStar).size(50);
const pathData = symbolGenerator();

function updateNodes(nodesSelector: SVGGElement) {
  d3.select(nodesSelector)
    .selectAll('path') // -> 빈 selection이라는 객체
    .data(nodes) // -> 6개 가상의 selection객체 6개 empty node
    .join('path') // -> selection path element 결정
    .attr('transform', (d) => `translate(${[d.x, d.y]})`)
    .attr('d', pathData);
  d3.select(nodesSelector)
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text((d) => d.name)
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y)
    .attr('dy', 5);
}

const ticked = (linksSelector: SVGGElement, nodesSelector: SVGGElement) => {
  updateLinks(linksSelector);
  updateNodes(nodesSelector);
};

const ReferenceGraph = ({ data }: ReferenceGraphProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const linkRef = useRef<SVGGElement | null>(null);
  const nodeRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const handleZoom = (e: any) => {
      d3.select(svgRef.current).selectChildren().attr('transform', e.transform);
    };

    const zoom = d3.zoom().on('zoom', handleZoom);

    d3.select(svgRef.current as Element).call(zoom);

    d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-200)) // 척력
      .force(
        'center',
        svgRef?.current && d3.forceCenter(svgRef.current.clientWidth / 2, svgRef.current.clientHeight / 2),
      )
      .force('link', d3.forceLink().links(links))
      .on('tick', () => {
        if (!linkRef.current || !nodeRef.current) return;
        ticked(linkRef.current, nodeRef.current);
      });
  }, []);

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
    stroke: #ccc;
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
    fill: #666;
    font-size: 16px;
  }
`;

export default ReferenceGraph;

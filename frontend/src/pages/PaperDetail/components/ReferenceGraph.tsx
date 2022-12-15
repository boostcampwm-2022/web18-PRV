import { IPaperDetail } from '@/api/api';
import { useGraph, useGraphData, useGraphEmphasize, useGraphZoom } from '@/hooks';
import { SimulationNodeDatum } from 'd3';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import InfoTooltip from './InfoTooltip';

interface ReferenceGraphProps {
  data: IPaperDetail;
  addChildrensNodes: (doi: string) => void;
  hoveredNode: string;
  changeHoveredNode: (key: string) => void;
}

export interface Node extends SimulationNodeDatum {
  [key: string]: string | boolean | number | null | undefined;
  title?: string;
  author?: string;
  isSelected: boolean;
  key: string;
  doi?: string;
  citations?: number;
  publishedYear?: number;
}

export interface Link {
  source: Node | string;
  target: Node | string;
}

const ReferenceGraph = ({ data, addChildrensNodes, hoveredNode, changeHoveredNode }: ReferenceGraphProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const linkRef = useRef<SVGGElement | null>(null);
  const nodeRef = useRef<SVGGElement | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const { nodes, links } = useGraphData(data);
  const { drawLink, drawNode } = useGraph(nodeRef.current, linkRef.current, addChildrensNodes, changeHoveredNode);

  useGraphZoom(svgRef.current);
  useGraphEmphasize(nodeRef.current, linkRef.current, nodes, links, hoveredNode, data.key);

  useEffect(() => {
    if (!svgRef.current) return;

    if (workerRef.current !== null) {
      workerRef.current.terminate();
    }

    workerRef.current = new Worker(new URL('../workers/forceSimulation.worker.ts', import.meta.url));

    // 서브스레드로 nodes, links, 중앙좌표 전송
    workerRef.current.postMessage({
      nodes,
      links,
      centerX: svgRef.current?.clientWidth / 2,
      centerY: svgRef.current?.clientHeight / 2,
    });

    workerRef.current.onmessage = (event) => {
      const { newNodes, newLinks } = event.data as { newNodes: Node[]; newLinks: Link[] };
      if (!newLinks) return;
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

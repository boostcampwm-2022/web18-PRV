import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import useGraphData from '../../../hooks/graph/useGraphData';
import useGraphHover from '../../../hooks/graph/useGraphHover';
import useGraphZoom from '../../../hooks/graph/useGraphZoom';
import useLinkUpdate from '../../../hooks/graph/useLinkUpdate';
import useNodeUpdate from '../../../hooks/graph/useNodeUpdate';
import { IPaperDetail } from '../PaperDetail';

interface ReferenceGraphProps {
  data: IPaperDetail;
  addChildrensNodes: (node: any) => void;
  hoveredNode: string;
  changeHoveredNode: (key: string) => void;
}

const ReferenceGraph = ({ data, addChildrensNodes, hoveredNode, changeHoveredNode }: ReferenceGraphProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const linkRef = useRef<SVGGElement | null>(null);
  const nodeRef = useRef<SVGGElement | null>(null);

  const { nodes, links } = useGraphData<{ nodes: any[]; links: any[] }>(data);

  const updateLinks = useLinkUpdate(links);
  const updateNodes = useNodeUpdate(nodes, changeHoveredNode, addChildrensNodes);

  useGraphZoom(svgRef.current);
  useGraphHover(nodeRef.current, nodes, hoveredNode);

  useEffect(() => {
    const ticked = (linksSelector: SVGGElement, nodesSelector: SVGGElement) => {
      updateLinks(linksSelector);
      updateNodes(nodesSelector);
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-200).distanceMax(200)) // 척력
      .force(
        'center',
        svgRef?.current && d3.forceCenter(svgRef.current.clientWidth / 2, svgRef.current.clientHeight / 2),
      )
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.key),
      )
      .on('tick', () => {
        if (!linkRef.current || !nodeRef.current) return;
        ticked(linkRef.current, nodeRef.current);
      });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, updateLinks, updateNodes]);

  return (
    <Container>
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
    font-size: 8px;
    cursor: pointer;

    :hover {
      fill-opacity: 100%;
    }
  }
`;

export default ReferenceGraph;

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IPaperDetail } from '../../../api/api';
import useGraphData from '../../../hooks/graph/useGraphData';
import useGraphEmphasize from '../../../hooks/graph/useGraphEmphasize';
import useGraphZoom from '../../../hooks/graph/useGraphZoom';
import useLinkUpdate from '../../../hooks/graph/useLinkUpdate';
import useNodeUpdate from '../../../hooks/graph/useNodeUpdate';
import InfoTooltip from './InfoTooltip';

interface ReferenceGraphProps {
  data: IPaperDetail;
  addChildrensNodes: (doi: string) => void;
  hoveredNode: string;
  changeHoveredNode: (key: string) => void;
}

// Todo : any 걷어내기, 구조 리팩터링하기, 프론트 테스트
const ReferenceGraph = ({ data, addChildrensNodes, hoveredNode, changeHoveredNode }: ReferenceGraphProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const linkRef = useRef<SVGGElement | null>(null);
  const nodeRef = useRef<SVGGElement | null>(null);

  const { nodes, links } = useGraphData<{ nodes: any[]; links: any[] }>(data);

  const updateLinks = useLinkUpdate(links);
  const updateNodes = useNodeUpdate(nodes, changeHoveredNode, addChildrensNodes);

  useGraphZoom(svgRef.current);
  useGraphEmphasize(nodeRef.current, linkRef.current, nodes, links, hoveredNode, data.key);

  useEffect(() => {
    const ticked = (linksSelector: SVGGElement, nodesSelector: SVGGElement) => {
      updateLinks(linksSelector);
      updateNodes(nodesSelector);
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-200).distanceMax(200))
      .force(
        'center',
        svgRef?.current && d3.forceCenter(svgRef.current.clientWidth / 2, svgRef.current.clientHeight / 2),
      )
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.key),
      )
      .on('tick', () => linkRef.current && nodeRef.current && ticked(linkRef.current, nodeRef.current));

    return () => {
      simulation.stop();
    };
  }, [nodes, links, updateLinks, updateNodes]);

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

import * as d3 from 'd3';
import { Link, Node } from '../components/ReferenceGraph';

interface DataProps {
  data: {
    nodes: Node[];
    links: Link[];
    centerX: number;
    centerY: number;
  };
}

self.onmessage = ({ data }: DataProps) => {
  const { nodes, links, centerX, centerY } = data;
  const simulation = d3
    .forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-200).distanceMax(200))
    .force('center', d3.forceCenter(centerX, centerY))
    .force(
      'link',
      d3.forceLink(links).id((d) => (d as Node).key),
    )
    .on('tick', () => {
      self.postMessage({ type: 'tick', newNodes: nodes, newLinks: links });
      if (simulation.alpha() < simulation.alphaMin()) {
        simulation.stop();
        self.postMessage({ type: 'stop' });
      }
    });
};

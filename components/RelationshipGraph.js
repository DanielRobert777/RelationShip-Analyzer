import React, { useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 60;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';
  });

  return { nodes, edges };
};

const initialUser = 'john_doe';
const initialRelationships = [
  { username: 'amy_smith', relationship: 'friend', interactions: 10 },
  { username: 'mike_brown', relationship: 'family', interactions: 8 },
  { username: 'jane_lee', relationship: 'associate', interactions: 6 },
  { username: 'bob_gray', relationship: 'friend', interactions: 5 },
];

export default function RelationshipGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const mainNode = {
      id: initialUser,
      data: { label: `${initialUser} (User)` },
      position: { x: 0, y: 0 },
    };

    const relNodes = initialRelationships.map((rel, i) => ({
      id: rel.username,
      data: { label: `${rel.username} (${rel.relationship})` },
      position: { x: 0, y: 0 },
    }));

    const relEdges = initialRelationships.map((rel) => ({
      id: `e-${initialUser}-${rel.username}`,
      source: initialUser,
      target: rel.username,
    }));

    const layouted = getLayoutedElements([mainNode, ...relNodes], relEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}

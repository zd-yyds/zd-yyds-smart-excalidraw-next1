let idCounter = 0;

function genId() {
  idCounter += 1;
  return `node-${idCounter}`;
}

function pickColor(depth, branchIndex) {
  const palette = [
    '#f4b6ff',
    '#b28dff',
    '#7aa2ff',
    '#6ef2ff',
    '#9afcbd',
    '#ffe39a',
  ];
  const i = (depth + branchIndex) % palette.length;
  return palette[i];
}

function layoutTree(root, cx, cy, baseR, stepR) {
  const nodes = [];
  const edges = [];

  function place(node, depth, angleCenter, angleSpan, parent) {
    const id = genId();
    const children = Array.isArray(node.children) ? node.children : [];
    if (depth === 0) {
      nodes.push({ id, node, depth, x: cx, y: cy });
    } else {
      const r = baseR + stepR * (depth - 1);
      const x = Math.round(cx + r * Math.cos(angleCenter));
      const y = Math.round(cy + r * Math.sin(angleCenter));
      nodes.push({ id, node, depth, x, y });
      if (parent) edges.push({ from: parent.id, to: id });
    }
    if (children.length === 0) return;
    const span = angleSpan * 0.6;
    const start = angleCenter - span / 2;
    for (let i = 0; i < children.length; i++) {
      const a = start + ((i + 0.5) / children.length) * span;
      place(children[i], depth + 1, a, span, { id });
    }
  }

  place(root, 0, 0, Math.PI * 2, null);
  return { nodes, edges };
}

export function convertMindmapToElements(mindmap) {
  idCounter = 0;
  const root = mindmap?.mindmap?.root || mindmap?.root || mindmap;
  if (!root || typeof root.text !== 'string') return [];

  const { nodes, edges } = layoutTree(root, 0, 0, 240, 240);

  const idMap = new Map();
  const elements = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const id = n.id;
    idMap.set(n, id);
    elements.push({
      type: 'rectangle',
      id,
      x: n.x,
      y: n.y,
      label: { text: String(n.node.text), fontSize: Math.max(14, 22 - n.depth * 2) },
      backgroundColor: pickColor(n.depth, i),
    });
  }

  for (const e of edges) {
    const from = nodes.find(nn => nn.id === e.from);
    const to = nodes.find(nn => nn.id === e.to);
    const dx = (to.x - from.x);
    const dy = (to.y - from.y);
    elements.push({
      type: 'arrow',
      x: from.x,
      y: from.y,
      width: dx,
      height: dy,
      strokeColor: '#a78bfa',
      start: { id: e.from },
      end: { id: e.to },
    });
  }

  return elements;
}


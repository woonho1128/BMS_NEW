export function isPathActive(locationPath, targetPath) {
  if (!targetPath) return false;
  if (targetPath === '/') return locationPath === '/';
  return locationPath === targetPath || locationPath.startsWith(targetPath + '/');
}

export function allChildrenAreCategoryGroups(node) {
  if (!Array.isArray(node.children) || node.children.length === 0) return false;
  return node.children.every(
    (c) => Array.isArray(c.children) && c.children.length > 0 && c.children.every((g) => !g.children || g.children.length === 0)
  );
}

export function collectAllMenuItems(nodes, result = []) {
  nodes.forEach((node) => {
    if (node.path) result.push(node);
    if (node.children) collectAllMenuItems(node.children, result);
  });
  return result;
}

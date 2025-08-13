
export const spiralArc = (fromRadius, toRadius, width, fromAngle, toAngle) => {
  const x1 = fromRadius * Math.sin(fromAngle);
  const y1 = fromRadius * -Math.cos(fromAngle);
  const x2 = (fromRadius + width) * Math.sin(fromAngle);
  const y2 = (fromRadius + width) * -Math.cos(fromAngle);
  const x3 = toRadius * Math.sin(toAngle);
  const y3 = toRadius * -Math.cos(toAngle);
  const x4 = (toRadius + width) * Math.sin(toAngle);
  const y4 = (toRadius + width) * -Math.cos(toAngle);
  return `
    M ${x1},${y1} 
    L ${x2},${y2} 
    A ${fromRadius},${fromRadius} 1 0 1 ${x4},${y4} 
    L ${x3},${y3}
    A ${fromRadius},${fromRadius} 0 0 0 ${x1},${y1}`;
}
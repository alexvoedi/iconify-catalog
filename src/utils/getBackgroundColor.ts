export function getBackgroundColor(svg: string): string {
  if (svg.includes('fill="none"')) {
    return 'rgb(140, 140, 144)'
  }

  if (
    svg.includes('fill="white"')
    || svg.includes('fill=\'#ffffff\'') || svg.includes('fill="#ffffff"')
    || svg.includes('fill=\'#fff\'') || svg.includes('fill="#fff"')
  ) {
    return 'rgb(36, 36, 40)'
  }

  if (
    svg.includes('fill="black"')
    || svg.includes('fill=\'#000000\'') || svg.includes('fill="#000000"')
    || svg.includes('fill=\'#000\'') || svg.includes('fill="#000"')
  ) {
    return '#ddd'
  }

  return '#ccc'
}

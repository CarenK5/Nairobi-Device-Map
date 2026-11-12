const W = 800, H = 700;
// Latitude/longitude to SVG coordinates for the Nairobi bounding box
export const project = ([la, lo]) => [((lo - 36.7) / 0.25) * W, ((-1.18 - la) / 0.22) * H];
// Road distance estimate: haversine x 1.35
export const roadKm = (a, b) => {
  const r = (x) => (x * Math.PI) / 180, dl = r(b[0] - a[0]), dn = r(b[1] - a[1]);
  const h = Math.sin(dl / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dn / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h)) * 1.35;
};

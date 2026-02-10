const functions = require("firebase-functions");
const ngeohash = require("ngeohash");

function getGeohashes(lat, lon, radius, precision) {
  const step = 0.001;
  const hashes = new Set();

  for (let la = lat - 0.03; la < lat + 0.03; la += step) {
    for (let lo = lon - 0.03; lo < lon + 0.03; lo += step) {
      const d = Math.sqrt((la - lat) ** 2 + (lo - lon) ** 2) * 111000;
      if (d <= radius) {
        hashes.add(ngeohash.encode(la, lo, precision));
      }
    }
  }
  return [...hashes];
}

exports.geohashRadius = functions.https.onRequest((req, res) => {
  const { lat, lon, radius, precision } = req.body;

  const hashes = getGeohashes(
    parseFloat(lat),
    parseFloat(lon),
    parseInt(radius),
    parseInt(precision)
  );

  res.json(hashes);
});

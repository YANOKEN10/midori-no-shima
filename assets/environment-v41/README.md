# Environment redesign v41

Generated with the built-in image_gen tool. Original generated atlas files are retained here.

- interiors.png: hospital counter, six-pod healer, medical bed, waiting bench, home kitchen, dining table, bookcase, quilted bed.
- facilities.png: ferry sofa, bridge helm, cabin bed, nautical sideboard, arena reception, trophy display, grandstands, planter.
- coast.png: sandstone rocks, driftwood, dune flowers, pier piling, harbor crates, lamp, tide pool.
- shops.png: eight regional merchandise cabinets: woodland, maritime, floral, alpine, futuristic, snow, tropical, emerald.
- shop-sides.png: left/right facing vertical shelves for woodland, maritime, floral and modern shops.

## Final prompt set
All: original top-down 16-bit RPG pixel art; complete uncropped objects; four columns by two rows; generous gutters; no people, labels or ground squares; coherent pixel density.
Interiors: ivory/coral hospital reception, six turquoise healing pods, mint bed, teal bench; oak kitchen, table with mugs/books, oak bookcase, terracotta quilt.
Facilities: navy/brass passenger ferry sofa, helm/radar, cabin bed, nautical sideboard; purple/gold arena counter, glass trophy cabinet, three-tier indigo grandstand, planter.
Coast: layered sandstone boulder, smaller rocks, driftwood/shells, dune flowers, rope piling, crates/net, teal lamp and rock pool. Background-only edit retained the neutral matte version for runtime extraction.
Shops: rustic oak herb shelving; navy/brass sea supplies; cream/pink flowers; walnut alpine supplies; silver/navy cyan glass; birch ice-blue glass; bamboo tropical baskets; emerald/gold boutique. Background-only edit removed the blurred backdrop.
Side shelves: north-south long axis, merchandise facing left or right, paired woodland/naval/floral/modern designs. Final background-only edit uses flat RGB 255,0,255 chroma matte.

src/decorArt.js extracts cell bounds and border-connected neutral/chroma matte at runtime, retaining the originals. Transparent interiors/facilities preserve their generated alpha. Walkable regions and collisions are authored separately in src/data/environmentLayouts.js and roomLayouts.js.


export const boundingBox = points => {

  let box = {
    max: [-Infinity, -Infinity],
    min: [Infinity,  Infinity],
  }

  ;[0,1]
        .forEach(k => {

          box.max[k] = points.reduce((max, point) => Math.max(max, point[k])  , -Infinity)

          box.min[k] = points.reduce((min, point) => Math.min(min, point[k])  ,  Infinity)

        })

  return box
}

export const expandBoundingBox = (box, m) => {
  box.max[ 0 ] += m
  box.max[ 1 ] += m
  box.min[ 0 ] -= m
  box.min[ 1 ] -= m

  return box
}

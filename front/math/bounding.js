export const boundingBox = points => {

    let box = {
        max: {x:-Infinity, y:-Infinity},
        min: {x: Infinity, y: Infinity},
    }

    points.forEach( p => {

        if ( box.max.x < p.x )
            box.max.x = p.x

        if ( box.max.y < p.y )
            box.max.y = p.y

        if ( box.min.x > p.x )
            box.min.x = p.x

        if ( box.min.y > p.y )
            box.min.y = p.y
    })

    return box
}

export const expandBoundingBox = (box, m) => {
    box.max.x += m
    box.max.y += m
    box.min.y -= m
    box.min.x -= m

    return box
}

export const boundingTriangle = box => {

    return [
        box.min,
        {x: box.min.x, y: box.min.y + (box.max.y - box.min.y)*2},
        {x: box.min.x + (box.max.x - box.min.x)*2, y: box.min.y},
    ]
}

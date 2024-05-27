const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(b => b.likes)
    
    const sum = likes.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    )

    return sum
}

module.exports = {
    dummy,
    totalLikes
}
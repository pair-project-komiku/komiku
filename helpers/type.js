'use strict'

function changeText(text) {
    if (text === 'Regular') {
        return text.toLowerCase()
    } else {
        return text.toUpperCase()
    }
}

module.exports = changeText
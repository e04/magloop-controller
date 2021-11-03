import { useState } from "react"

const BOARD_URL = 'http://192.168.0.115/'
export const BOARD_MAX_VALUE = 3120;

const positionParser = async (response: Response) => {
    const json = await response.json()

    if (json.hasOwnProperty('position')) {
        return json as { position: number }
    }
    throw new Error('invalid response')
}

export const useBoardClient = () => {
    const [position, setPosition] = useState(0);
    const [isBusy, setIsBusy] = useState(false);

    const reset = async () => {
        setIsBusy(true)
        const { position } = await fetch(BOARD_URL + '?reset')
            .then(positionParser)
        setPosition(position)
        setIsBusy(false)
    }

    const move = async (length: number) => {
        setIsBusy(true)
        const { position } = await fetch(BOARD_URL + '?move=' + length)
            .then(positionParser)
        setPosition(position)
        setIsBusy(false)
    }

    const moveTo = async (toPosition: number) => {
        setIsBusy(true)
        const { position } = await fetch(BOARD_URL + '?moveTo=' + toPosition)
            .then(positionParser)
        setPosition(position)
        setIsBusy(false)
    }

    const getPosition = async () => {
        setIsBusy(true)
        const { position } = await fetch(BOARD_URL + '?position')
            .then(positionParser)
        setPosition(position)
        setIsBusy(false)
    }

    return { position, reset, move, moveTo, getPosition, isBusy }
}


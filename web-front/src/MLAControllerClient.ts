import { useState } from "react"

const positionParser = async (response: Response) => {
    const json = await response.json()

    if (json.hasOwnProperty('position')) {
        return json as { position: number }
    }
    throw new Error('invalid response')
}

export const useMLAControllerClient = (option:{boardAddress: string}) => {
    const [position, setPosition] = useState(0);
    const [isBusy, setIsBusy] = useState(false);

    const reset = async () => {
        setIsBusy(true)
        const { position } = await fetch(option.boardAddress + '?reset')
            .then(positionParser)
        setPosition(position)
        setIsBusy(false)
    }

    const move = async (length: number) => {
        setIsBusy(true)
        const { position } = await fetch(option.boardAddress + '?move=' + length)
            .then(positionParser)
        setPosition(position)
        setIsBusy(false)
    }

    const moveTo = async (toPosition: number) => {
        setIsBusy(true)
        const { position } = await fetch(option.boardAddress + '?moveTo=' + toPosition)
            .then(positionParser)
        setPosition(position)
        setIsBusy(false)
    }

    const getPosition = async () => {
        setIsBusy(true)
        const { position } = await fetch(option.boardAddress + '?position')
            .then(positionParser)
        setPosition(position)
        setIsBusy(false)
    }

    return { position, reset, move, moveTo, getPosition, isBusy }
}


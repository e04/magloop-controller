import { useState } from "react"
import { MLA_1, MLA_2 } from "./useBandSetting"

const stateParser = async (response: Response) => {
    const json = await response.json()

    if (json.hasOwnProperty('state')) {
        return json as { state: number }
    }
    throw new Error('invalid response')
}

export const useCoaxSwitcherClient = (option: { boardAddress: string }) => {
    const [state, setState] = useState(0);
    const [isBusy, setIsBusy] = useState(false);

    const getState = async () => {
        setIsBusy(true)
        const { state } = await fetch(option.boardAddress + '?state')
            .then(stateParser)
        setState(state)
        setIsBusy(false)
    }

    const switchToAntenna = async (antenna: MLA_1 | MLA_2) => {
        setIsBusy(true)
        const { state } = await fetch(option.boardAddress + '?' + antenna)
            .then(stateParser)
        setState(state)
        setIsBusy(false)
    }

    return { state, getState, switchToAntenna, isBusy }
}


import React from "react";

export const MLA_1 = 0;
export const MLA_2 = 1;
export type MLA_1 = typeof MLA_1;
export type MLA_2 = typeof MLA_2;
type Antenna = MLA_1 | MLA_2;

type BandWidth = {
    start: {
        freq: number,
        value: number
    };
    end: {
        freq: number,
        value: number
    }
    antenna: Antenna
}

type State = {
    '7MHz': BandWidth,
    '10MHz': BandWidth,
    '14MHz': BandWidth,
    '18MHz': BandWidth,
    '21MHz': BandWidth,
    '24MHz': BandWidth,
    '28MHz': BandWidth,
};

type Band = keyof State

type Action =
    | { type: "set", payload: { band: Band, side: 'start' | 'end', value: number } }

const LOCAL_STORAGE_KEY = '30u9dsdgsdht3fsdfjut23utjgrdojf032d'

const initialState: State = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? 'null') ?? {
    '7MHz': {
        start: {
            freq: 7000,
            value: 2500
        },
        end: {
            freq: 7200,
            value: 2400
        },
        antenna: MLA_1
    },
    '10MHz': {
        start: {
            freq: 10100,
            value: 2000
        },
        end: {
            freq: 10150,
            value: 1900
        },
        antenna: MLA_1
    },
    '14MHz': {
        start: {
            freq: 14000,
            value: 200
        },
        end: {
            freq: 14350,
            value: 100
        },
        antenna: MLA_1
    },
    '18MHz': {
        start: {
            freq: 18068,
            value: 200
        },
        end: {
            freq: 18168,
            value: 100
        },
        antenna: MLA_2
    },
    '21MHz': {
        start: {
            freq: 21000,
            value: 200
        },
        end: {
            freq: 21450,
            value: 100
        },
        antenna: MLA_2
    },
    '24MHz': {
        start: {
            freq: 24890,
            value: 200
        },
        end: {
            freq: 24990,
            value: 100
        },
        antenna: MLA_2
    },
    '28MHz': {
        start: {
            freq: 28000,
            value: 200
        },
        end: {
            freq: 29000,
            value: 100
        },
        antenna: MLA_2
    },
    '29MHz': {
        start: {
            freq: 29000,
            value: 200
        },
        end: {
            freq: 29700,
            value: 100
        },
        antenna: MLA_2
    },
};

const reducer: React.Reducer<State, Action> = (state: State, action: Action) => {
    const newState = (() => {
        switch (action.type) {
            case "set":
                return {
                    ...state,
                    [action.payload.band]: {
                        ...state[action.payload.band],
                        [action.payload.side]: {
                            ...state[action.payload.band][action.payload.side],
                            value: action.payload.value
                        }
                    }
                };
        }

        throw new Error()
    })()

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))

    return newState
};

export const useBandSetting = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    return { state, dispatch }
}
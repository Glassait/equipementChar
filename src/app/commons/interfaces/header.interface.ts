export interface HeaderInterface {
    showHome: boolean;
    showTank: boolean;
    showWar: boolean;
    showAdmin: boolean;
}

export const INITIAL_STATE_HEADER: HeaderInterface = {
    showHome: false,
    showTank: true,
    showWar: true,
    showAdmin: false,
};

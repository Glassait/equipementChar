import { ShellEnum } from '../enums/shell.enum';

export type Shell = {
    name: ShellEnum;
    amount: number;
    premium: boolean;
};

export type FieldComposant = {
    name: string;
    image: string;
    active: boolean;
};

export type Field = {
    level: number;
    field: {
        left: FieldComposant;
        right: FieldComposant;
    };
};

export type Equipment = {
    name: string;
    modernized: boolean;
};

export type Equipments = {
    first: Equipment[];
    second: Equipment[];
};

export type Consumables = {
    first: string[];
    second: string[];
};

export type Directive = {
    name: string;
    image: string;
};

export type Link = {
    name: string;
    url: string;
};

export type TankData = {
    name: string;
    priority: number;
    crew: string[];
    skills: string[][];
    shells: Shell[];
    fields: Field[];
    directive: Directive;
    equipments: Equipments;
    consumables: Consumables;
    links: Link[];
};

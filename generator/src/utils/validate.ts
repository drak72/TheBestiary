/** Assertion Utils */
import assert from 'node:assert';

export const environment = (envars: string[]) => {
    return envars.reduce((acc: { [key: string]: string }, envar: string) => {
        assert(process.env[envar], `Required environment variable not found: ${envar}. Required Envars are ${JSON.stringify(envars)}`);
        acc[envar] = process.env[envar] as string;
        return acc;
    }, {});
};

export const validate = {
    environment,
};

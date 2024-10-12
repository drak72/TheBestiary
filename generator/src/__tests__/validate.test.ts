import { it, describe, expect } from 'vitest';
import { validate } from '../utils/validate';
import { AssertionError } from 'assert';

describe("Validate Tests", () => { 
    it("Validate.Environment: Happy path", () => {
        const test1 = 'xyzzy';
        const test2 = 'something';

        process.env.TEST1 = test1;
        process.env.TEST2 = test2;
        
        const { TEST1, TEST2 } = validate.environment(['TEST1', 'TEST2']);

        expect(TEST1).toStrictEqual(test1);
        expect(TEST2).toStrictEqual(test2);
    })

    it("Validate.Environment: Sad Path", () => { 
        const test1 = 'zyxxz';
        const test2 = 'badnewbears';

        process.env.TEST1 = test1;

        try {
            const { TEST1, TEST2 } = validate.environment(['TEST1', 'TEST2']);
        } catch (e) {
            expect(e).toBeInstanceOf(AssertionError);
        }
    })
})
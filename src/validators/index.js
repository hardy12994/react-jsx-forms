import { StaticValidators } from './staticValidators';
import { DyanamicValidators } from './dynamicValidators';


export const Validators = {
    //static
    minChar: StaticValidators.minChar,
    maxChar: StaticValidators.maxChar,
    required: StaticValidators.required,
    pattern: StaticValidators.pattern,
    matchLength: StaticValidators.matchLength,


    //dynaic
    compose: DyanamicValidators.compose

};
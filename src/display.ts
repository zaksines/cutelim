// import from ast
import {Prop} from './ast.js'; 
import {Proof, Ax, WeakenL, WeakenR, makeCut, 
    Invalid, AndIntroL1, AndIntroL2} from './proofs.js';  


let begin = '\\( \\begin{prooftree} '; 
let end = ' \\end{prooftree} \\)';
let vars = new Map<string, Prop>(); 

function makeVarIntro(typ : string, l : string, 
    premise? : Proof, r? : string) : Proof | Invalid {
        if (!premise && typ != 'ax') {
            return 'invalid'; 
        }
        if (!vars.has(l)) {
            vars.set(l, new Prop('var', l)); 
        }
        switch (typ) {
            case 'ax': return new Ax(vars.get(l)); 
            case 'weakenL': return new WeakenL(premise, vars.get(l));
            case 'weakenR': return new WeakenR(premise, vars.get(l)); 
            case 'andIntroL1': {
                if (!r) {
                    return 'invalid'; 
                } 
                if (!vars.has(r)) {
                    vars.set(r, new Prop('var', r)); 
                }
                return new AndIntroL1(premise, vars.get(l), vars.get(r)); 
            }
            case 'andIntroL2': {
                if (!r) {
                    return 'invalid'; 
                } 
                if (!vars.has(r)) {
                    vars.set(r, new Prop('var', r)); 
                }
                return new AndIntroL2(premise, vars.get(l), vars.get(r)); 
            }
        }
    }




// import from ast
import {Prop} from './ast.js'; 
import {Proof, Ax, WeakenL, WeakenR, isInvalid, makeCut, 
    Invalid, AndIntroL1, AndIntroL2, AndIntroR} from './proofs.js';  
import {AndRCutAndL} from './cutelim.js'; 

let begin = '\\( \\begin{prooftree} '; 
let end = ' \\end{prooftree} \\)';
let vars = new Map<string, Prop>(); 

// Used when working with atomic propositions (strings) to ensure that they are only instaniated once.
function makeVarIntro(typ : string, l : string, vars : Map<string, Prop>,
    premise? : Proof | Invalid, r? : string) : Proof | Invalid {
        if (isInvalid(premise)) {
            return 'invalid'; 
        }
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
                if (!premise.conclusion.left.has(vars.get(l))) {
                    return 'invalid'; 
                }
                let and = new Prop('and', null, vars.get(l), vars.get(r)); 
                if (!vars.has(and.toString())) {
                    vars.set(and.toString(), and); 
                }
                return new AndIntroL1(premise, vars.get(and.toString())); 
            }
            case 'andIntroL2': {
                if (!r) {
                    return 'invalid'; 
                } 
                if (!vars.has(r)) {
                    vars.set(r, new Prop('var', r)); 
                }
                if (!premise.conclusion.left.has(vars.get(r))) {
                    return 'invalid'; 
                }
                let and = new Prop('and', null, vars.get(l), vars.get(r)); 
                if (!vars.has(and.toString())) {
                    vars.set(and.toString(), and); 
                }
                return new AndIntroL2(premise, vars.get(and.toString())); 
            }
        }
    }

function makeAndIntroR(leftPremise : Proof, rightPremise : Proof, 
    l : Prop, r : Prop, vars : Map<string, Prop>) : AndIntroR | Invalid {
        if (!leftPremise.conclusion.sequentEqual(rightPremise.conclusion,
             [l, r])) {
                return 'invalid'; 
            }
        if (!leftPremise.conclusion.right.has(l) || !rightPremise.conclusion.right.has(r)) {
            return 'invalid'; 
        }
        let and = new Prop('and', null, l, r); 
        if (!vars.has(and.toString())) {
            vars.set(and.toString(), and); 
        }
        return new AndIntroR(leftPremise, rightPremise, vars.get(and.toString())); 
    }

/* function send(p : Proof | Invalid) {
    const para = document.body.appendChild(document.createElement('p'));  
    if (p == "invalid") {
        para.textContent = 'invalid' + '\n'; 
        return; 
    }
    para.textContent = begin + p.toString() + end + '\n'; 
} */

export {makeVarIntro}; 





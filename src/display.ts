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

function send(p : Proof | Invalid) {
    const para = document.body.appendChild(document.createElement('p'));  
    if (p == "invalid") {
        para.textContent = 'invalid' + '\n'; 
        return; 
    }
    para.textContent = begin + p.toString() + end + '\n'; 
}

/* let A = makeVarIntro('ax', 'A', vars);
let B = makeVarIntro('ax', 'B', vars); 
let ABwA = makeVarIntro('weakenL', 'B', vars, A as Proof);
let ABwB = makeVarIntro('weakenL', 'A', vars, B as Proof);
let andR = makeAndIntroR(ABwA as Proof, ABwB as Proof, vars.get('A'), vars.get('B'), vars); 
send(andR as Proof);

let andL = makeVarIntro('andIntroL1', 'A', vars, A as Proof, 'B'); 
send(andL as Proof); 

let c = makeCut(andR as Proof, andL as Proof, (andR as AndIntroR).and);
console.log((andR as AndIntroR).and);
send(c); 

if (!isInvalid(c)) {
    send(AndRCutAndL(c)); 
} */

let A = makeVarIntro('ax', 'A', vars); 
let wl = makeVarIntro('weakenR', 'B', vars, A); 
let and = makeVarIntro('andIntroL1', 'A', vars, wl, 'B'); 
let andand = makeVarIntro('andIntroL1', (and as AndIntroL1).and.toString(), vars, and, 'C'); 
send(andand);

export {makeVarIntro}; 





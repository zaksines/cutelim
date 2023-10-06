// import from ast
import {Prop} from '../build/ast.js'; 
import {Ax, WeakenL, WeakenR, makeCut} from '../build/proofs.js';  


let begin = '\\( \\begin{prooftree} '; 
let end = ' \\end{prooftree} \\)';
let vars = new Map(); 

function makeAx(a) {
    if (!vars.has(a)) {
        vars.set(a, new Prop("var", a)); 
    }
    return new Ax(vars.get(a)); 
}

function makeWeakenL(p, a) {
    if (!vars.has(a)) {
        vars.set(a, new Prop("var", a));
    }
    return new WeakenL(p, vars.get(a)); 
}

function makeWeakenR(p, a) {
    if (!vars.has(a)) {
        vars.set(p, new Prop("var", a)); 
    }
    return new WeakenR(p, vars.get(a)); 
}
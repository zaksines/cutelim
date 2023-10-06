import {Prop, Sequent} from "../build/ast.js"

interface Proof {
    proofType: string; 
    conclusion: Sequent, 
    premises: Proof[], 
    toString() : string; 
}

class Ax implements Proof {
    proofType = "ax"; 
    conclusion: Sequent; 
    premises = []; 
    toString() {
        return `\\AxiomC{} \\UnaryInfC{\\( ${this.conclusion.toString()} \\)}`;
    }
    constructor(a : Prop) {
        let s = new Sequent(); 
        s.left.add(a);
        s.right.add(a);
        this.conclusion = s; 
    }
}

class WeakenL implements Proof {
    proofType = "weakenL"; 
    conclusion: Sequent; 
    premises: Proof[]; 

    toString() {
        let s = ""; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\UnaryInfC{\\( ${this.conclusion.toString()} \\)}`
        return s; 
    }

    constructor(p : Proof, a : Prop) {
        this.premises = [p]; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p.conclusion, [], []); 
        this.conclusion.left.add(a); 
    }
}

class WeakenR implements Proof {
    proofType = "weakenR"; 
    conclusion: Sequent; 
    premises: Proof[]; 

    toString() {
        let s = ""; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += ` \\UnaryInfC{\\( ${this.conclusion.toString()} \\)} `
        return s; 
    }

    constructor(p : Proof, a : Prop) {
        this.premises = [p]; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p.conclusion, [], []); 
        this.conclusion.right.add(a); 
    }
}

class Cut implements Proof {
    proofType = "cut"; 
    conclusion: Sequent; 
    premises : Proof[]; 
    toString() {
        let s = ""; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\BinaryInfC{\\( ${this.conclusion.toString()} \\)}`
        return s; 
    }

    constructor(p1: Proof, p2: Proof, bridge: Prop) {
        this.premises = [p1, p2]; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p1.conclusion, [], [bridge]); 
        this.conclusion.sequentCopy(p2.conclusion, [bridge], []); 
    }
}

type Invalid = "invalid"; 

function makeCut(p1 : Proof, p2 : Proof, bridge : Prop): Cut | Invalid {
    if (!p1.conclusion.right.has(bridge) || !p2.conclusion.left.has(bridge)) {
        return "invalid"; 
    } 
    return new Cut(p1, p2, bridge); 
}

export{Proof, Ax, WeakenL, WeakenR, makeCut}; 
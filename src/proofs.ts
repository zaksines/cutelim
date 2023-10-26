import {Prop, Sequent} from './ast.js'

interface Proof {
    proofType: string; 
    conclusion: Sequent, 
    premises: Proof[], 
    toString() : string;
    getSize() : number; 
    numCuts() : number; 
}

class Ax implements Proof {
    proofType = 'ax'; 
    conclusion: Sequent; 
    premises = []; 
    toString() {
        return `\\RightLabel{ Ax } \\AxiomC{} 
        \\UnaryInfC{\\( ${this.conclusion.toString()} \\)}`; 
    }
    constructor(a : Prop) {
        this.premises = null; 
        let s = new Sequent(); 
        s.left.add(a);
        s.right.add(a);
        this.conclusion = s; 
    }

    getSize() {
        return 1; 
    }

    numCuts() {
        return 0; 
    }
}

class WeakenL implements Proof {
    proofType = 'weakenL'; 
    conclusion: Sequent; 
    premises: Proof[]; 
    size : number; 
    cuts : number; 
    toString() {
        let s = ''; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\RightLabel{ WL } 
        \\UnaryInfC{\\( ${this.conclusion.toString()} \\)}`
         
        return s; 
    }

    constructor(p : Proof, a : Prop) {
        this.premises = [p]; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p.conclusion, [], []); 
        this.conclusion.left.add(a); 
        this.size = 1 + this.premises[0].getSize(); 
        this.cuts = this.premises[0].numCuts(); 

    }

    getSize() {
        return this.size; 
    }

    numCuts() {
        return this.cuts; 
    }
}

class WeakenR implements Proof {
    proofType = 'weakenR'; 
    conclusion: Sequent; 
    premises: Proof[]; 
    size : number; 
    cuts : number; 

    toString() {
        let s = ''; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += ` \\RightLabel{ WR }
         \\UnaryInfC{\\( ${this.conclusion.toString()} \\)}` 
        
        return s; 
    }

    constructor(p : Proof, a : Prop) {
        this.premises = [p]; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p.conclusion, [], []); 
        this.conclusion.right.add(a); 
        this.size = 1 + this.premises[0].getSize(); 
        this.cuts = this.premises[0].numCuts();
    }

    getSize() {
        return this.size; 
    }

    numCuts() {
        return this.cuts; 
    }
}

class Cut implements Proof {
    proofType = 'cut'; 
    conclusion: Sequent; 
    premises : Proof[]; 
    size : number; 
    cuts : number; 

    toString() {
        let s = ''; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\RightLabel{ Cut } 
        \\BinaryInfC{\\( ${this.conclusion.toString()} \\)}`;
        
        return s; 
    }

    constructor(p1: Proof, p2: Proof, bridge: Prop) {
        this.premises = [p1, p2]; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p1.conclusion, [], [bridge]); 
        this.conclusion.sequentCopy(p2.conclusion, [bridge], []); 
        this.size = 1 + this.premises[0].getSize() + this.premises[1].getSize(); 
        this.cuts = 1 + this.premises[0].numCuts() + this.premises[1].numCuts(); 
    }

    getSize() {
        return this.size; 
    }

    numCuts() {
        return this.cuts; 
    }
}

type Invalid = 'invalid'; 

function isInvalid(a : Proof | Invalid) : a is Invalid {
    return a == 'invalid'; 
}

function isProof(a : Proof | Invalid) : a is Proof {
    return !isInvalid(a); 
}

function makeCut(p1 : Proof, p2 : Proof, bridge : Prop): Cut | Invalid {
    if (!p1.conclusion.right.has(bridge) || !p2.conclusion.left.has(bridge)) {
        return "invalid"; 
    } 
    return new Cut(p1, p2, bridge); 
}

class AndIntroL1 implements Proof {
    proofType = 'andIntroL1'; 
    conclusion : Sequent; 
    premises: Proof[]; 
    size : number; 
    cuts : number; 
    and : Prop; 

    toString() {
        let s = ''; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\RightLabel{\\( \\land L_1 \\)} 
        \\UnaryInfC{\\( ${this.conclusion.toString()} \\)}`;
        return s;
    }

    constructor(p1 : Proof, and : Prop) {
        this.premises = [p1]; 
        this.and = and;  
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p1.conclusion, [and.left], []); 
        this.conclusion.left.add(and); 
        this.size = 1 + this.premises[0].getSize();  
        this.cuts = this.premises[0].numCuts(); 
    }

    getSize() {
        return this.size; 
    }

    numCuts() {
        return this.cuts; 
    }
}

function isL1(p : Proof) : p is AndIntroL1 {
    return p.proofType == 'andIntroL1'; 
}

class AndIntroL2 implements Proof {
    proofType = 'andIntroL2'; 
    conclusion : Sequent; 
    premises : Proof[]; 
    size : number; 
    cuts : number; 
    and : Prop; 

    toString() {
        let s = ''; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\RightLabel{\\( \\land L_2 )\\} 
        \\UnaryInfC{\\( ${this.conclusion.toString()} \\)}`;
        return s;
    }

    constructor(p1 : Proof, and : Prop) {
        this.premises = [p1]; 
        this.and = and; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p1.conclusion, [and.right], []); 
        this.conclusion.left.add(and); 
        this.size = 1 + this.premises[0].getSize();  
        this.cuts = this.premises[0].numCuts(); 
    }

    getSize() {
        return this.size; 
    }

    numCuts() {
        return this.cuts; 
    }
}


function isL2(p : Proof) : p is AndIntroL2 {
    return p.proofType == 'andIntroL2'; 
}

class AndIntroR implements Proof {
    proofType = 'andIntroR'; 
    conclusion : Sequent; 
    premises : Proof[]; 
    size : number;
    cuts : number; 
    and : Prop; 

    toString() {
        let s = ''; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\RightLabel{\\( \\land R\\)} 
        \\BinaryInfC{\\( ${this.conclusion.toString()} \\)}`;
        return s;
    }

    constructor(p1 : Proof, p2 : Proof, and : Prop) {
        this.premises = [p1, p2]; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p1.conclusion, [], [and.left, and.right]); 
        this.and = and; 
        this.conclusion.right.add(and); 
        this.size = 1 + this.premises[0].getSize() + 1 + this.premises[1].getSize(); 
        this.cuts = this.premises[0].numCuts(); 
    }

    getSize() {
        return this.size; 
    }

    numCuts() {
        return this.cuts; 
    }
}



export {Proof, Ax, WeakenL, WeakenR, Cut, makeCut, Invalid, isInvalid, isProof,
     AndIntroL1, AndIntroL2, AndIntroR, isL1, isL2}; 
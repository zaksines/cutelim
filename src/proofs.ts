import {Prop, Sequent} from './ast'

interface Proof {
    proofType: string; 
    conclusion: Sequent, 
    premises: Proof[], 
    toString() : string;
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
    }

}

class Cut implements Proof {
    proofType = 'cut'; 
    conclusion: Sequent; 
    premises : Proof[]; 
    bridge : Prop; 

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
    }
}

class NegR implements Proof {
    proofType = 'negR'; 
    conclusion : Sequent; 
    premises : Proof[]; 
    size : number; 
    cuts : number; 
    neg : Prop; 

    constructor(p : Proof, A : Prop) {
        this.premises = [p]; 
        this.neg = A; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p.conclusion, [A.left], []); 
        this.conclusion.right.add(this.neg); 
    }

    toString() {
        let s = ''; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\RightLabel{ \\( \\neg R \\) } 
        \\UnaryInfC{ \\( ${this.conclusion.toString()} \\) }`
        return s; 
    }
}

function isNegR(p : Proof) : p is NegR {
    return p.proofType == 'negR'; 
}

function makeNegR(p : Proof, A : Prop, vars : Map<string, Prop>) : Proof | Invalid {
    if (!p.conclusion.left.has(A)) {
        return 'invalid'; 
    } 
    let neg = new Prop('negation', null, A); 
    if (!vars.has(neg.toString())) {
        vars.set(neg.toString(), neg);
    }
    return new NegR(p, vars.get(neg.toString())); 
}

class NegL implements Proof {
    proofType = 'negL'; 
    conclusion : Sequent; 
    premises : Proof[]; 
    size : number; 
    cuts : number; 
    neg : Prop; 

    constructor(p : Proof, A : Prop) {
        this.premises = [p]; 
        this.neg = A; 
        this.conclusion = new Sequent(); 
        this.conclusion.sequentCopy(p.conclusion, [], [A.left]); 
        this.conclusion.left.add(this.neg); 
    }

    toString() {
        let s = ''; 
        for (const p of this.premises) {
            s += p.toString(); 
        }
        s += `\\RightLabel{ \\( \\neg L \\) } 
        \\UnaryInfC{ \\( ${this.conclusion.toString()} \\) }`
        return s; 
    }
}

function isNegL(p : Proof) : p is NegL {
    return p.proofType == 'negL'; 
}

function makeNegL(p : Proof, A : Prop, vars : Map<string, Prop>) : Proof | Invalid {
    if (!p.conclusion.right.has(A)) {
        return 'invalid'; 
    }
    let neg = new Prop('negation', null, A); 
    if (!vars.has(neg.toString())) {
        vars.set(neg.toString(), neg); 
    }
    return new NegL(p, vars.get(neg.toString())); 
}

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

export {Proof, Ax, WeakenL, WeakenR, Cut, makeCut, Invalid, isInvalid, isProof,
     AndIntroL1, AndIntroL2, AndIntroR, isL1, isL2, NegR, NegL, isNegL, isNegR, makeNegR, makeNegL, 
    makeVarIntro, makeAndIntroR}; 
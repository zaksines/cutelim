type Prop = string | Negation | Tensor | Par 

class Negation {
    constructor(public readonly arg: Prop) {}
}

class Tensor {
    constructor(public readonly left: Prop, public readonly right: Prop) {} 
}

class Par {
    constructor(public readonly left: Prop, public readonly right: Prop) {}
}

class Sequent {
    public readonly left : Set<Prop>;
    public readonly right : Set<Prop>; 

    constructor() {
        this.left = new Set<Prop>(); 
        this.right = new Set<Prop>(); 
    }

    toString() {
        return [...this.left].join(', ') + ' \\vdash ' + [...this.right].join(', '); 
    }
}

interface Proof {
    conclusion: Sequent, 
    premise: Proof | null

    toString() : void; 
}

let begin = '\\( \\begin{prooftree} '; 
let end = ' \\end{prooftree} \\)';

class Ax implements Proof {
    conclusion: Sequent; 
    premise = null; 
    toString() {
        return begin + `\\AxiomC{} \\UnaryInfC{\\( ${this.conclusion.toString()} \\)}` + end; 
    }

    constructor(a : string) {
        let s = new Sequent(); 
        s.left.add(a);
        s.right.add(a);
        this.conclusion = s; 
    }
}

export {Prop, Negation, Tensor, Par}; 
export {Sequent, Proof, Ax}; 



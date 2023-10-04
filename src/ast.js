class Negation {
    arg;
    constructor(arg) {
        this.arg = arg;
    }
}
class Tensor {
    left;
    right;
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
}
class Par {
    left;
    right;
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
}
class Sequent {
    left;
    right;
    constructor() {
        this.left = new Set();
        this.right = new Set();
    }
    toString() {
        return [...this.left].join(', ') + ' \\vdash ' + [...this.right].join(', ');
    }
}
let begin = '\\( \\begin{prooftree} ';
let end = ' \\end{prooftree} \\)';
class Ax {
    conclusion;
    premise = null;
    toString() {
        return begin + `\\AxiomC{} \\UnaryInfC{\\( ${this.conclusion.toString()} \\)}` + end;
    }
    constructor(a) {
        let s = new Sequent();
        s.left.add(a);
        s.right.add(a);
        this.conclusion = s;
    }
}
export { Negation, Tensor, Par };
export { Sequent, Ax };

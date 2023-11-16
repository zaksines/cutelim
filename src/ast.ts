type propType = "var" | "negation" | "and" | "or" | "Empty" 

class Prop {
    constructor(readonly typ: propType, readonly val? : string, readonly left? : Prop,
        readonly right? : Prop) {} 

    toString(Prop? : Prop) {
        switch (this.typ) {
            case "var": {
                let s = this.val; 
                if (this == Prop) {
                    s = '\\color{blue} \\underline{' + s + '} \\color{black}'; 
                }
                return s; 
            }
            case "negation": {
                let s = '\\neg (' + 
                (this.left ? this.left.toString(Prop) : '__' + ') '); 
                if (this == Prop) {
                    s = '\\color{blue} \\underline{' + s + '} \\color{black}'; 
                }
                return s; 
            }
            case "and": {
                let s = ' (' + 
                (this.left ? this.left.toString(Prop) : 'x') + ' \\land ' + 
                (this.right ? this.right.toString(Prop) : 'x') + ') '; 
                if (this == Prop) {
                    s = '\\color{blue} \\underline{' + s + '} \\color{black}'; 
                }
                return s; 
            }
            case "or": {
                let s =  ' (' + 
                (this.left ? this.left.toString() : '__' + ' \\lor ') + 
                (this.right ? this.right.toString() : '__' + ') ') ; 
                if (this == Prop) {
                    s = '\\color{blue} \\underline{' + s + '} \\color{black}'; 
                }
            }
        }
    }
}

// Used to copy props for React. 
function propCopy(p : Prop) : Prop {
    switch (p.typ) {
        case 'var': return new Prop('var', p.val); 
        case 'negation': return new Prop('negation', null, propCopy(p.left)); 
        case 'and': return new Prop('and', null, propCopy(p.left), propCopy(p.right));
        case 'or': return new Prop('or', null, propCopy(p.left), propCopy(p.right)); 
    }
}

function setEquals<T>(s1 : Set<T>, s2 : Set<T>, exc : T[]) {
    if (s1.size != s2.size) {
        return false; 
    }
    for (const x of s2.values()) {
        if (!s1.has(x) && !exc.includes(x)) {
            return false; 
        }
    }
    for (const x of s1.values()) {
        if (!s2.has(x) && !exc.includes(x)) {
            return false; 
        }
    }
    return true; 
}


class Sequent {
    public readonly left : Set<Prop>;
    public readonly right : Set<Prop>; 

    constructor() {
        this.left = new Set<Prop>(); 
        this.right = new Set<Prop>(); 
    }

    toString() {
        let arr = []; 
        [...this.left].map((x) => {
            arr.push(x.toString()); 
        }); 
        let s = arr.join(', '); 
        s += ' \\vdash '; 
        arr = []; 
        [...this.right].map((x) => {
            arr.push(x.toString()); 
        }); 
        return s + arr.join(', '); 
    }

    sequentEqual(seq2 : Sequent, exc : Prop[]) {
        return setEquals(this.left, seq2.left, exc) &&
        setEquals(this.right, seq2.right, exc); 
    }

    sequentCopy(seq2 : Sequent, 
        exc1 : Prop[], exc2 : Prop[]) {
            for (const x of seq2.left.values()) {
                if (!exc1.includes(x)) {
                    this.left.add(x); 
                }
            }
            for (const x of seq2.right.values()) {
                if (!exc2.includes(x)) {
                    this.right.add(x); 
                }
            }
        }
    }


export {Prop, Sequent, propCopy}; 



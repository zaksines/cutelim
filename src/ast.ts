type propType = "var" | "negation" | "and" | "or"

class Prop {
    constructor(readonly typ: propType, readonly val? : string, readonly left? : Prop,
        readonly right? : Prop) {} 

    toString() {
        switch (this.typ) {
            case "var": {
                return this.val; 
            }
            case "negation": {
                return '\\neg ' + this.left.toString(); 
            }
            case "and": {
                return this.left.toString() + ' \\land ' + this.right.toString(); 
            }
            case "or": {
                return this.left.toString() + ' \\lor ' + this.right.toString(); 
            }
        }
    }
}

function equals(p1 : Prop, p2: Prop) {
    if (p1.typ != p2.typ) {
        return false; 
    }
    switch (p1.typ) {
        case "var": {
            return p1.typ == p2.typ; 
        }
        case "negation": {
            return equals(p1.left, p2.left); 
        }
        default: {
            return equals(p1.left, p2.left) && equals(p1.right, p2.right); 
        }
    }
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


export {Prop, Sequent}; 



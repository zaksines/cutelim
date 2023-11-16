import {Ax, Cut, makeCut, Proof, Invalid, isL1, isL2, isNegR, isNegL, makeVarIntro} from './proofs';
import { Prop } from './ast'; 
// Left premise is Ax. 
function AxCutL(c : Cut) : Proof | Invalid {
    if (c.premises[0].proofType != 'ax') {
        return 'invalid'; 
    }
    return c.premises[1]; 
}

// Right premise is Ax. 
function AxCutR(c : Cut) : Proof | Invalid {
    if (c.premises[1].proofType != 'ax') {
        return 'invalid'; 
    }
    return c.premises[0]; 
}

// When AndIntroR meets AndIntroL. 
function AndRCutAndL(c : Cut) : Cut | Invalid {
    let andL = c.premises[1]; 
    let bridgeProp; 
    let p1; 
    if (isL1(andL) && c.premises[0].proofType == 'andIntroR') {
        bridgeProp = andL.and.left; 
        p1 = c.premises[0].premises[0]; 
    } else if (isL2(andL) && c.premises[1].proofType == 'andIntroR') {
        bridgeProp = andL.and.right; 
        p1 = c.premises[1].premises[1]; 
    } else {
        return 'invalid'; 
    }
    return new Cut(p1, c.premises[1].premises[0], bridgeProp); 
}

// When NegR meets NegL 
function NegRCutNegL(c : Cut) : Cut | Invalid {
    if (isNegR(c.premises[0]) && isNegL(c.premises[1])) {
        return makeCut(c.premises[1].premises[0], c.premises[0].premises[0], c.premises[0].neg.left);
    } else {
        return 'invalid'; 
    }
}

// When a cut premise is a weaken.
function WCut(c : Cut, vars : Map<string, Prop>) : Proof | Invalid {
    if (c.premises[1].proofType != 'weakenL' && c.premises[0].proofType != 'weakenR') {
        return 'invalid'; 
    }
    let p : Proof | 'invalid'; 
    if (c.premises[1].proofType == 'weakenL') {
        p = c.premises[0]; 
        for (const x of c.premises[1].conclusion.left.values()) {
            if (x != c.bridge) {
                p = makeVarIntro('weakenL', x.toString(), vars, p); 
            }
        }
        for (const x of c.premises[1].conclusion.right.values()) {
            p = makeVarIntro('weakenR', x.toString(), vars, p); 
        }
    }
    else if (c.premises[0].proofType == 'weakenR') {
        p = c.premises[1]; 
        for (const x of c.premises[0].conclusion.left.values()) {
            p = makeVarIntro('weakenL', x.toString(), vars, p); 
        }
        for (const x of c.premises[0].conclusion.right.values()) {
            if (x != c.bridge) {
                p = makeVarIntro('weakenR', x.toString(), vars, p); 
            }
        }
    }
    return p; 
}



export {AxCutL, AxCutR, AndRCutAndL, NegRCutNegL, WCut}; 
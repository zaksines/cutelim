import {Ax, Cut, makeCut, Proof, Invalid, isL1, isL2} from './proofs.js';

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


function AndRCutAndL(c : Cut) : Cut | Invalid {
    let andL = c.premises[1]; 
    let bridgeProp; 
    let p1; 
    if (isL1(andL)) {
        bridgeProp = andL.and.left; 
        p1 = c.premises[0].premises[0]; 
    } else if (isL2(andL)) {
        bridgeProp = andL.and.right; 
        p1 = c.premises[1].premises[1]; 
    } else {
        return 'invalid'; 
    }
    return new Cut(p1, c.premises[1].premises[0], bridgeProp); 
}



export {AxCutL, AxCutR, AndRCutAndL}; 
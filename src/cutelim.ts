import {Ax, Cut, makeCut, Proof} from './proofs.js';

// Left premise is Ax. 
function AxCutL(c : Cut) : Proof {
    return c.premises[1]; 
}

// Right premise is Ax. 
function AxCutR(c : Cut) : Proof {
    return c.premises[0]; 
}
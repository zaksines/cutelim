import { MathJax } from 'better-react-mathjax'; 
import { useState } from 'react'; 
import {Prop, propCopy} from './ast'; 
import {Proof, Ax, WeakenL, WeakenR, isInvalid, makeCut, 
    Invalid, AndIntroL1, AndIntroL2, AndIntroR, Cut, 
    makeNegR, makeNegL, NegR, NegL, makeVarIntro, makeAndIntroR} from './proofs';  
import {AndRCutAndL, NegRCutNegL, WCut } from './cutelim'; 


// Invariant: only one of 'and' | 'or' is true at any moment. 
// Should I use a union type for that? 
function Input({ vars, and, setAndFalse, or, setOrFalse }) {
    
    const [prevParts, setPrevParts] = useState<Prop[]>([]); 
    const [arrProp, setArrProps] = useState<Prop[]>([null]); 
    const [currProp, setCurrProp] = useState(0); 
    const [currPart, setCurrPart] = useState<Prop>(null); 
    const [dirParts, setDirParts] = useState<string[]>([]); 

    function editProps(e : React.KeyboardEvent) {
        // e.repeat isn't working when checked like this
        if (e.key == 'ArrowLeft' && currProp > 0 && e.shiftKey) {
            // same here with resetting state. 
            if (arrProp[currProp] == null) {
                const arr = arrProp.slice(); 
                arr.pop();
                setArrProps(arr);
            }
            setCurrProp(currProp - 1); 
            setCurrPart(arrProp[currProp - 1]);
        } else if (e.key == 'ArrowRight' && e.shiftKey) {
            if (currPart == null) {
                return; 
            }
            setCurrProp(currProp + 1); 
            // need to reset currPart and other state. 
            if (arrProp.length <= currProp) {
                const arr = arrProp.slice();
                arr.push(null);
                setArrProps(arr);  
            }
            setCurrPart(arrProp[currProp + 1]);
        } else if (e.key == 'ArrowLeft' && currPart) {
            if (currPart.typ == 'and' || currPart.typ == 'or') {
                const arr = prevParts.slice();
                arr.push(currPart); 
                setPrevParts(arr);
                setCurrPart(currPart.left); 

                const dirs = dirParts.slice();
                dirs.push('left');
                setDirParts(dirs);
            }
        } else if (e.key == 'ArrowRight' && currPart) {
            if (currPart.typ == 'and' || currPart.typ == 'or') {
                const arr = prevParts.slice();
                arr.push(currPart); 
                setPrevParts(arr);
                setCurrPart(currPart.right); 

                const dirs = dirParts.slice();
                dirs.push('right');
                setDirParts(dirs);
            }
        } else if (e.key == 'ArrowDown') {
            if (prevParts.length != 0) {
                const arr = prevParts.slice();
                setCurrPart(arr.pop());
                setPrevParts(arr);

                const dirs = dirParts.slice();
                dirs.pop();
                setDirParts(dirs);
            }
        } else if (e.key == 'Enter') {

        } else if (!/^[a-z]$/i.test(e.key)) {
            e.preventDefault();
        } else { 
            let x; 
            if (and) {
                x = new Prop('and', null, new Prop('var', e.key.toUpperCase(), null), currPart); 
                setCurrPart(x);
            } else {
                x = new Prop('var', e.key.toUpperCase(), null, null); 
                setCurrPart(x);
            }

            // Using queues to create a copy of the old Prop to edit it.  
            let d = dirParts.slice();
            d.reverse();
            
            let p = prevParts.map(x => propCopy(x)); 
            let newPrev = []; 
            let curr = x; 

            // Does negation need special treatment? 
            for (let i = 0; i < d.length; i++) { 
                let prop = p.pop();
                if (d[i] == 'left') {
                    curr = new Prop(prop.typ, null, curr, prop.right);
                    newPrev.push(curr);

                } else if (d[i] == 'right') {
                    curr = new Prop(prop.typ, null, prop.left, curr); 
                    newPrev.push(curr);
                }
            } 
            setPrevParts(newPrev.reverse());
            
            const arr = arrProp.slice();
            arr[currProp] = curr; 
            setArrProps(arr);

            setAndFalse();
            
        }
    }

    return <> 
    <div className="prop" tabIndex={-1} onKeyDown={editProps}> 
        <MathJax dynamic={true}>{'\\( [' + arrProp + ' ]' + 
    (arrProp[currProp] ? arrProp[currProp].toString(currPart) : '@') + '\\)'}</MathJax>
     </div>
    </>
}

function ProofTree({ vars }) {

    const [triggerAnd, setAnd] = useState(false);
    const [triggerOr, setOr] = useState(false);

    return ( <>
        <Input vars={vars} and={triggerAnd} setAndFalse={() => setAnd(false)}
        or={triggerOr} setOrFalse={() => setOr(false)}/> 
        <Input vars={vars} and={triggerAnd} setAndFalse={() => setAnd(false)}
        or={triggerOr} setOrFalse={() => setOr(false)}/> 

        <button onClick={() => {
            setAnd(true); 
            setOr(false);
        }}> <MathJax> \( \\\land \)  </MathJax> </button>
        <button onClick={() => {
            setAnd(false);
            setOr(true);
        }}> <MathJax> \( \\\lor \) </MathJax> </button> 
        <button> <MathJax> \( \\\neg \) </MathJax> </button> 
        </> ); 
}

export default function Display() {
    const vars = new Map<string, Prop>(); 
    function fun(p : Prop) {
        document.getElementById('prooftree').textContent = p.toString(); 

    }
    return <> <ProofTree vars={vars} /> <p id="prooftree"> </p> </>
}






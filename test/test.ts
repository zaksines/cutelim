import {strict as assert} from 'assert'; 
import {Prop} from '../src/ast.js'; 
import {Proof, Invalid, isInvalid, isProof, isL1} from '../src/proofs.js'; 
import {makeVarIntro} from '../src/display.js'; 

describe('makeVarIntro', function() {
    let A : Proof | Invalid; 
    let B : Proof | Invalid;
    let vars : Map<string, Prop>; 
    beforeEach(function () {
        vars = new Map<string, Prop>(); 
        A = makeVarIntro('ax', 'A', vars); 
        B = makeVarIntro('ax', 'B', vars); 
    });

    it('Should always treat ax proofs as valid', function() {
        assert.ok(isProof(A)); 
        assert.ok(isProof(B)); 
        assert.equal(A.getSize(), 1); 
        assert.equal(A.numCuts(), 0); 
        assert.equal(B.getSize(), 1); 
        assert.equal(B.numCuts(), 0); 
    }); 

    it('Should require a premise for valid weakenL proof', function() {
        let i = makeVarIntro('weakenL', 'B', vars); 
        assert.ok(isInvalid(i)); 
        i = makeVarIntro('weakenL', 'B', vars, null); 
        assert.ok(isInvalid(i)); 
    }); 

    it('Should create valid proof with WeakenL and Ax', function() {
        let wl = makeVarIntro('weakenL', 'B', vars, A); 
        assert.ok(isProof(wl)); 
        assert.equal(wl.getSize(), 2); 
        assert.equal(wl.numCuts(), 0); 
    });

    it('Should require a premise for valid weakenR proof', function() {
        let i = makeVarIntro('weakenR', 'B', vars); 
        assert.ok(isInvalid(i)); 
        i = makeVarIntro('weakenR', 'B', vars, null); 
        assert.ok(isInvalid(i)); 
    }); 

    it('Should create a valid proof with WeakenR and Ax', function() {
        let wr = makeVarIntro('weakenR', 'B', vars, A); 
        assert.ok(isProof(wr)); 
        assert.equal(wr.getSize(), 2); 
        assert.equal(wr.numCuts(), 0); 

    }); 

    it('Should create a valid andIntroL1 proof with Ax', function() {
        let AandB = makeVarIntro('andIntroL1', 'A', vars, A, 'B'); 
        assert.ok(isProof(AandB)); 
        assert.equal(AandB.getSize(), 2); 
        assert.equal(AandB.numCuts(), 0); 
    }); 

    it('Should treat new left as invalid for AndIntroL1', function() {
        let CandB = makeVarIntro('andIntroL1', 'C', vars, A, 'B'); 
        assert.ok(isInvalid(CandB)); 
    });

    it('Should have order matter for old variable in AndIntroL1', function() {
        let BandA = makeVarIntro('andIntroL1', 'B', vars, A, 'B'); 
        assert.ok(isInvalid(BandA)); 
    });

    it('More complex example (Ax => Weaken R => AndIntroL1 => AndIntroL1)', function() {
        let wl = makeVarIntro('weakenR', 'B', vars, A); 
        let and = makeVarIntro('andIntroL1', 'A', vars, wl, 'B'); 
        assert.ok(isProof(and));
        assert.equal(and.getSize(), 3); 
        assert.equal(and.numCuts(), 0); 
        assert.ok(isL1(and)); 
        let andand = makeVarIntro('andIntroL1', and.and.toString(), vars, and, 'C'); 
        assert.ok(isProof(andand)); 
        assert.equal(andand.getSize(), 4); 

    }); 


});
import {MathJaxContext} from 'better-react-mathjax'; 
import { createRoot } from 'react-dom/client'; 


import Display from './display'; 
import './style.css'; 


document.body.innerHTML = '<div id="app"> </div>'; 

const root = createRoot(document.getElementById('app')); 
root.render(<MathJaxContext>  <Display/> </MathJaxContext>); 


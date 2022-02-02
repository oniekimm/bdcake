import * as dat from 'dat.gui';

const gui = new dat.GUI();
gui.domElement.parentElement.style.zIndex = 10;

// var actions = {
//     save: function() {
//         console.log(gui.getSaveObject());
//     }
// };
//
// gui.add(actions, 'save');

export default gui;

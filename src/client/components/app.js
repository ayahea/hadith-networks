import { h, Component } from 'preact';
import { Controller } from '../controller';
import Cytoscape from 'cytoscape';
//import { elements, style } from '../cy-conf';
import { elements_orig, elements_aishah53, style } from '../cy-conf';
import CytoscapeComponent from './cytoscape';
import { isDev } from '../env';
import { NodeInfo } from './node-info';
import { Menu } from './menu';

class AppComponent extends Component {
  constructor(props){
    super(props);

    //ayah
    let cy = new Cytoscape();     
    
    // I believe this is from the line "h(AppComponent, {'data':..." in each elements' corresponding <XNAME>.js file in src/client. 
    // So if props.data = 'test' this means it's from the src/client/test.js file which corresponds to elements_test.js
    console.log(props.data); 

/*    cy = new Cytoscape({ 
      elements,
      style,
      layout: { 
        name: 'preset',
      },
      selectionType: 'single',
      boxSelectionEnabled: false
    }); */
    if (props.data === 'orig') { //this is the default elements_orig.js file (which corresponds to the src/client/orig.js)
      cy = new Cytoscape({
        elements: elements_orig,
        style,
        layout: { 
          name: 'preset',
        },
        selectionType: 'single',
        boxSelectionEnabled: false
      });
    } 
    else if (props.data === 'aishah53') {
      cy = new Cytoscape({
        elements: elements_aishah53,
        style,
        layout: { 
          name: 'preset',
        },
        selectionType: 'single',
        boxSelectionEnabled: false
      });
    } 

    cy.nodes().panify().ungrabify();

    const controller = new Controller({ cy });
    const bus = controller.bus;

    if( isDev ){
      window.cy = cy;
      window.controller = controller;
    }

    this.state = { controller, cy };

    bus.on('showInfo', this.onShowInfo = (node => {
      this.setState({ infoNode: node });
    }));

    bus.on('hideInfo', this.onHideInfo = (() => {
      this.setState({ infoNode: null });
    }));
  }

  componentWillUnmount(){
    const bus = this.state.controller.bus;

    bus.removeListener('showInfo', this.onShowInfo);
    bus.removeListener('hideInfo', this.onHideInfo);
  }

  render(){
    const { cy, controller, infoNode } = this.state;

    return h('div', { class: 'app' }, [
      h(CytoscapeComponent, { cy, controller }),

      infoNode ? (
        h('div', { class: 'app-node-info' }, [
          h(NodeInfo, { node: infoNode })
        ])
      ) : null,

      h(Menu, { controller })
    ]);
  }
}

export default AppComponent;
export { AppComponent };
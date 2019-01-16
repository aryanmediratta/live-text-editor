import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import fire from './fire';
import firebase from 'firebase';

import 'brace/mode/java';
import 'brace/theme/github';

// import 'materialize-css/dist/css/materialize.min.css';

var database =fire.database();

const languages = [
  'javascript',
  'java',
  'python',
  'xml',
  'ruby',
  'sass',
  'markdown',
  'mysql',
  'json',
  'html',
  'handlebars',
  'golang',
  'csharp',
  'elixir',
  'typescript',
  'css',
]

languages.forEach(lang => {
  require(`brace/mode/${lang}`);
  require(`brace/snippets/${lang}`);
});

const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal',
];

themes.forEach(theme => {
  require(`brace/theme/${theme}`);
});

// document.addEventListener('DOMContentLoaded', function() {
//     var elems = document.querySelectorAll('.dropdown-trigger');
//     var instances = M.Dropdown.init(elems, options);
//   });

class Ace extends Component {

  constructor(props){ //Construction of a constructor to Initialize the values
      super(props);  //To get data from parent class
      this.state = {
        value : "" ,
        mode : 'javascirpt',
        theme : 'github',
        users: 1
      }
      this.onChange = this.onChange.bind(this)
      this.setMode = this.setMode.bind(this)
      this.setTheme = this.setTheme.bind(this)
    }

    // countUsers(){
    //   database.ref('ace/connections').update({
    //         users: this.state.users
    //       })
    // }

    checkUsers(){
      var myConnectionsRef = firebase.database().ref('ace/connections');
      var _this = this;
// stores the timestamp of my last disconnect (the last time I was seen online)
// var lastOnlineRef = firebase.database().ref('ace/lastOnline');

var connectedRef = firebase.database().ref('.info/connected');
connectedRef.on('value', function(snap) {
  if (snap.val() === true) {

    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
    var con = myConnectionsRef.push();

    // When I disconnect, remove this device
    con.onDisconnect().remove();

    // Add this device to my connections list
    // this value could contain info about the device or a timestamp too
    con.set(true);

    // When I disconnect, update the last time I was seen online
    //lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
      }
    });

  }
  onChange(newValue) {
        database.ref('ace').update({
          body: newValue,
          // mode: this.state.mode,
          // theme: this.state.theme,
          // users : this.state.users
        })
    }

  setTheme(e) {
    // this.setState({
    //   theme: e.target.value,
    // });
    database.ref('ace').update({
          theme: e.target.value,
        })
  }

  setMode(e) {
    // this.setState({
    //   mode: e.target.value,
    // });
  database.ref('ace').update({
          mode: e.target.value,
        })
  }
     
    componentDidMount(){
    var _this = this;
    database.ref('ace').on('value', function(snapshot){ 
        var msg=snapshot.val();  
        _this.setState({
          value : msg.body // function snapshot se we get a json
        })  
    })
    database.ref('ace').on('value', function(snapshot){ 
        var msg=snapshot.val();  
        _this.setState({
          mode : msg.mode // function snapshot se we get a json
        })     
    })
    database.ref('ace').on('value', function(snapshot){ 
        var msg=snapshot.val();  
        _this.setState({
          theme : msg.theme // function snapshot se we get a json
        })  
    })
    this.checkUsers()
    //this.countUsers()
    database.ref('connections').on('child_added', function(snapshot){   
        _this.setState({
          users : this.state.users + 1
        })  
    })
  }
   render() {
   return (
<div>
       <div className="field">
            <label>Mode:</label>
            <p className="control">
              <span className="select">
                <select name="mode" onChange={this.setMode} value={this.state.mode}>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </span>
            </p>
          <div className="field">
            <label>Theme:</label>
              <p className="control">
                <span className="select">
                  <select name="Theme" onChange={this.setTheme} value={this.state.theme}>
                    {themes.map(lang => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </span>
              </p>
            </div>
            <h2>Code</h2>
            <AceEditor
            theme="github"
            name="blah2"
            theme = {this.state.theme}
            value = {this.state.value}
            mode = {this.state.mode}
            setTheme = {this.setTheme}
            setMode = {this.setMode}
            onChange={this.onChange}
            />
       </div>
</div>
);
}
}
export default Ace;
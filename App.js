import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, AppRegistry, Dimensions, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Constants } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-elements'; // Version can be specified in package.json

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      phoneNumberString:'',
      message:'',
      ModalON: false,
      receipientsValue:'',
      warningMessage:'',
      loadingOn:false,
      validOnes:[],
      cancelModal:false
    }
    this.sendMessage = this.sendMessage.bind(this);
  }

  clearAll(){
    this.setState({message:''});
    this.setState({receipientsValue:''});
    this.setState({phoneNumberString:''});
  }

  handleClose(){
    if(this.state.receipientsValue == ''){
      this.setState({ModalON: false});
    }else{
      this.setState({cancelModal: true});
    }
  }

  handleAdd(){
    var vals = this.state.receipientsValue;
    var arr = vals.split(' ');
    var validOnes = [];
    var valid = 0;
    var invalid = 0;
    var newString = '';

    if(vals.trim() == ''){
      this.setState({ModalON: false});
      return;
    }

    for (var i = arr.length - 1; i >= 0; i--) {
      if(/\b([\+-]?\d{2}|\d{4})\s*\(?\d+\)?\s*(?:\d+\s*)+\b/.test(arr[i])){
        validOnes.push(arr[i]);
        newString = newString +"   "+ arr[i];
        valid++;
      }else{
        invalid++;
      }
    }

    this.setState({validOnes: validOnes});
    this.setState({phoneNumberString: newString});

    this.setState({warningMessage: valid +" Valid and "+ invalid +" Numbers found"});
    this.setState({ModalON: false});
  }

  sendMessage(){
      if(this.state.message == ''){
        this.setState({warningMessage: "Blank Message...!!!"});
        return;
      }
      // this.setState({loadingOn: true});

      return fetch('https://private-amnesiac-55fcaa-frontenddevtest.apiary-proxy.com/message',{
          method:"POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
           },
           body:JSON.stringify({message: this.state.message,recipients: this.state.validOnes})
       })
      .then((response) => response.json())
      .then((responseJson) => { 
          Alert.alert('Message Sent Successfully');
          this.setState({message:''});
          this.setState({receipientsValue:''});
          this.setState({phoneNumberString:''});
          this.setState({warningMessage: ''});
      })
      .catch(function(error) {
        console.log(error);
          // this.setState({loadingOn: false});
          Alert.alert('Some Error Occured');
      });
  }

  handleConfirm(args){
    if(args == 'yes'){
      this.setState({ModalON: false});
      this.setState({cancelModal: false});
    }else{
      this.setState({cancelModal: false});
      this.setState({receipientsValue:''});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{
          fontSize:22,
          marginBottom:30
        }}>Send Message</Text>
        <View style={{
          flexDirection:'row',
          justifyContent:'space-between',
        }}>
          <Text style={{
              fontSize:19
            }}>Receipients</Text>
          <TouchableOpacity style={{
            alignSelf:'flex-end',
            borderWidth:1,
            borderColor:'black',
            padding:10,
            paddingTop:1,
            paddingBottom:1
          }} onPress={() => this.setState({ModalON: true})} >
            <Text style={{
              alignSelf:'center'
            }}>Add Receipient</Text>
          </TouchableOpacity>
        </View>
        <View style={{
          width:'99%',
          marginTop:10,
          alignSelf:'center',
          height: Dimensions.get('window').height/3,
          borderWidth:1.4,
          borderColor:'black'
        }}>
          <Text style={{
            fontSize:12,
            margin:5,
            color:'#696969',
            flexWrap:'wrap'
          }}>{this.state.phoneNumberString}</Text>
        </View>
        <View style={{
          flexDirection:'row',
          justifyContent:'space-between',
        }}>
          <Text style={{
              fontSize:19
            }}>Message</Text>
        </View>
        <TextInput style={{
          width:'99%',
          marginTop:10,
          alignSelf:'center',
          height: Dimensions.get('window').height/5,
          padding:10,
          maxHeight:Dimensions.get('window').height/5,
          borderWidth:1.4,
          borderColor:'black'
        }}
        multiline
        value={this.state.message}
        onChangeText={(text) => this.setState({message: text}) }
        ></TextInput>
        {
          this.state.loadingOn
          ?
          <ActivityIndicator size="large" color="#0000ff" style={{marginTop:10, alignSelf:'center'}} />
          :
          <View style={{
            marginTop:10,
            flexDirection:'row'
          }}>
            <TouchableOpacity style={{
              alignSelf:'flex-end',
              backgroundColor:'blue',
              padding:10,
              paddingTop:1,
              paddingBottom:1
            }} onPress={() => this.sendMessage()} >
              <Text style={{
                alignSelf:'center',
                color:'white'
              }}>Send Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              alignSelf:'flex-end',
              borderWidth:1,
              borderColor:'black',
              padding:10,
              paddingTop:1,
              paddingBottom:1,
              marginLeft:20
            }} onPress={() => this.clearAll()} >
              <Text style={{
                alignSelf:'center'
              }}>Clear</Text>
            </TouchableOpacity>
          </View>
        }
        {
          this.state.ModalON
          ?
          <View style={{
            height: Dimensions.get('window').height,
            position:'absolute',
            width: Dimensions.get('window').width,
            top:0,
            backgroundColor:'rgba(0,0,0,0.6)'
          }}>
              <View style={{
                width:'90%',
                alignSelf:'center',
                top:'30%',
                backgroundColor:'white'
              }}>
                  <View style={{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    backgroundColor:'#ccc',
                    padding:20
                  }}>
                      <Text style={{}}>Add Receipient</Text>
                      <TouchableOpacity style={{
                        alignSelf:'flex-end',
                        borderWidth:1,
                        borderColor:'black',
                        padding:10,
                        paddingTop:1,
                        paddingBottom:1,
                        marginLeft:20
                      }} onPress={() => this.handleClose()} >
                        <Text style={{
                          alignSelf:'center'
                        }}>X</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{
                    flexDirection:'row',
                    marginLeft:15,
                    justifyContent:'space-between',
                  }}>
                    <Text style={{
                        fontSize:19
                      }}>Receipients</Text>
                  </View>
                  <TextInput style={{
                    width:'90%',
                    marginTop:10,
                    alignSelf:'center',
                    height: Dimensions.get('window').height/5,
                    padding:10,
                    maxHeight:Dimensions.get('window').height/5,
                    borderWidth:1.4,
                    borderColor:'black'
                  }}
                  multiline
                  value={this.state.receipientsValue}
                  onChangeText={(text) => this.setState({receipientsValue: text}) }
                  ></TextInput>
                  <View style={{
                    marginTop:10,
                    width:'90%',
                    alignSelf:'center',
                    marginBottom:10,
                    flexDirection:'row'
                  }}>
                    <TouchableOpacity style={{
                      alignSelf:'flex-end',
                      backgroundColor:'blue',
                      padding:10,
                      paddingTop:1,
                      paddingBottom:1
                    }} onPress={() => this.handleAdd()} >
                      <Text style={{
                        alignSelf:'center',
                        color:'white'
                      }}>Add Receipients</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                      alignSelf:'flex-end',
                      borderWidth:1,
                      borderColor:'black',
                      padding:10,
                      paddingTop:1,
                      paddingBottom:1,
                      marginLeft:20
                    }} onPress={() => this.handleClose()} >
                      <Text style={{
                        alignSelf:'center'
                      }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
              </View>
          </View>
          :
          null
        }
        {
          this.state.cancelModal
          ?
          <View style={{
            height: Dimensions.get('window').height,
            position:'absolute',
            width: Dimensions.get('window').width,
            top:0,
            backgroundColor:'rgba(0,0,0,0.6)'
          }}>
              <View style={{
                width:'70%',
                alignSelf:'center',
                top:'30%',
                backgroundColor:'white',
                paddingTop:20
              }}>
                  <Text style={{alignSelf:'center'}} >Are you sure, you want to cancel ?</Text>
                  <View style={{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    marginTop:20,
                    width:'60%',
                    alignSelf:'center',
                    marginBottom:20
                  }}>
                    <TouchableOpacity style={{
                      alignSelf:'flex-end',
                      borderWidth:1,
                      borderColor:'black',
                      padding:10,
                      paddingTop:1,
                      paddingBottom:1
                    }} onPress={() => this.handleConfirm("yes") }>
                      <Text style={{
                        alignSelf:'center'
                      }}>YES</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                      alignSelf:'flex-end',
                      borderWidth:1,
                      borderColor:'black',
                      padding:10,
                      paddingTop:1,
                      paddingBottom:1
                    }} onPress={() => this.handleConfirm("no") }>
                      <Text style={{
                        alignSelf:'center'
                      }}>NO</Text>
                    </TouchableOpacity>
                  </View>
              </View>
          </View>
          :
          null
        }
        <Text style={{color:'red'}}>{this.state.warningMessage}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    backgroundColor: '#ecf0f1',
  },
 /* paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },*/
});

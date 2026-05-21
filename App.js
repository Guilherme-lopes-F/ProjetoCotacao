import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6tkGpA8pINnPeJdYb5wwDx8ERcaMNeq4",
  authDomain: "projetosifpe-9698f.firebaseapp.com",
  projectId: "projetosifpe-9698f",
  storageBucket: "projetosifpe-9698f.firebasestorage.app",
  messagingSenderId: "572971507528",
  appId: "1:572971507528:web:45fa1354b3aca098c65d7d",
  measurementId: "G-W7J880WRR3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Stack = createNativeStackNavigator();


// ================= LOGIN =================
function LoginScreen({navigation}){
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function login(){
    signInWithEmailAndPassword(auth, email, senha)
    .then(() =>{
      navigation.navigate('Home')
    })
    .catch(() => {
      alert("Erro no login")
    });
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#939393' }}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6388/6388307.png' }}
      />

      <Text style={styles.texto}>Login</Text>

      <TextInput style={styles.input}
        placeholder=" Digite seu Email"
        onChangeText={setEmail}
      />

      <Text style={styles.texto}>Senha</Text>
      <TextInput style={styles.input}
        placeholder="Digite sua Senha"
        secureTextEntry
        onChangeText={setSenha}
      />

      <View style={{ width: 300, marginBottom: 20 }}>
        <Button title="Entrar" onPress={login} />
      </View>

      <View style={{ width: 300 }}>
        <Button title="Cadastrar" onPress={() => navigation.navigate('Cadastro')} />
      </View>
    </View>
  );
}


// ================= CADASTRO =================
function CadastroScreen({navigation}){
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function cadastrar(){
    createUserWithEmailAndPassword(auth, email, senha)
    .then(() =>{
      alert('Cadastro realizado!');
      navigation.goBack();
    })
    .catch(() => {
      alert("Erro ao cadastrar")
    });
  }

  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#939393' }}>
      <Text style={styles.texto}>Email</Text>

      <TextInput style={styles.input}
        placeholder=" Digite seu Email"
        onChangeText={setEmail}
      />

      <Text style={styles.texto}>Senha</Text>
      <TextInput style={styles.input}
        placeholder="Digite sua Senha"
        secureTextEntry
        onChangeText={setSenha}
      />

      <View style={{width:300, marginTop:10}}>
        <Button title='Cadastrar' color='#0063c0' onPress={cadastrar} />
      </View>
    </View>
  );
}


// ================= HOME =================
function HomeScreen({navigation}){
  const [moedas, setMoedas] = useState([]);
  const [data, setData] = useState('');

  function buscar(){
    axios.get('https://economia.awesomeapi.com.br/json/all')
    .then((res) =>{
      setMoedas(Object.values(res.data));
      setData(new Date().toLocaleString());
    })
    .catch(() => {
      alert("Erro ao buscar cotações");
    })
  }

  useEffect(() =>{
    buscar();
  }, [])

  function getImage(code){
    // CRIPTOMOEDAS
    if(code === 'BTC') return 'https://cryptologos.cc/logos/bitcoin-btc-logo.png';
    if(code === 'ETH') return 'https://cryptologos.cc/logos/ethereum-eth-logo.png';
    if(code === 'LTC') return 'https://cryptologos.cc/logos/litecoin-ltc-logo.png';
    if(code === 'XRP') return 'https://cryptologos.cc/logos/xrp-xrp-logo.png';
    if(code === 'DOGE') return 'https://cryptologos.cc/logos/dogecoin-doge-logo.png';

   
    if(code === 'EUR') return 'https://flagcdn.com/w40/eu.png';

    return `https://flagcdn.com/w40/${code.toLowerCase().slice(0,2)}.png`;
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: '#939393', paddingBottom: 50 }}>

      <Text style={{fontSize: 25, marginTop:40}}> Cotação de Moedas</Text>
      <Text>Ultima atualização: {data} </Text>

      {moedas.map((item, index) => {
        const variacao = parseFloat(item.pctChange);
        const subiu = variacao >= 0;

        return (
          <View key={index} style={styles.card}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={styles.flag} source={{ uri: getImage(item.code) }} />
              <Text style={{ marginHorizontal: 5 }}>→</Text>
              <Image style={styles.flag} source={{ uri: 'https://flagcdn.com/w40/br.png' }} />
            </View>

            <Text> {item.code} → BRL </Text>

            <Text style={styles.preco}>
              R$ {parseFloat(item.bid).toFixed(2)}
            </Text>

            <View style={{ width: '100%', alignItems: 'flex-end' }}>
              <Text style={{
                color: subiu ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                {subiu ? '▲' : '▼'} {variacao.toFixed(2)}%
              </Text>
            </View>

          </View>
        )
      })}

      <TouchableOpacity style={styles.botao} onPress={buscar}>
        <Text style={{ color: '#fff' }}>Atualizar Cotações</Text>
      </TouchableOpacity>

      <View style={{ width: 300, marginTop: 60 }}>
        <Button title="Logout" onPress={() => {
          signOut(auth);
          navigation.navigate('login');
        }} />
      </View>

    </ScrollView>
  )
}


// ================= APP =================
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='login' component={LoginScreen} />
        <Stack.Screen name='Cadastro' component={CadastroScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// ================= STYLES =================
const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
  },
  input: {
    height: 50,
    width: 300,
    backgroundColor: '#f5f5ee',
    marginBottom: 10,
  },
  texto: {
    marginRight: 250,
    marginTop: 20,
    fontSize: 20,
  },
  card: {
    width: 250,
    padding: 25,
    backgroundColor: '#f5f5ee',
    marginTop: 40,
    alignItems: 'center',
    borderRadius: 12
  },
  flag: {
    width: 40,
    height: 25,
    marginBottom: 5
  },
  botao: {
    backgroundColor: '#00FF00',
    padding: 15,
    marginTop: 20,
    borderRadius: 10
  },
  preco:{
    fontSize:20,
    fontWeight:'bold'
  }
});

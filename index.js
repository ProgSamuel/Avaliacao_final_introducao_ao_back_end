const express = require("express");
const app = express();
app.use(express.json());

const usuariosCadastrados = [];
let idUsuario = 0;
const recados = [];
let idRecado = 0;
var userlogged 

// Middleware para VERIFICAR se o usuário está logado
function verificarLogin(req, res, next) {
    if (userlogged) {
      next();
  } else {
    res.status(401).send('Acesso não autorizado. Faça o login primeiro.');
  }
}

app.get("/", (req, res)=> {
  res.send(`Bem vindo a API Recados!
  
  Abaixo está as rotas e o método que você precisa usar!
  
  Função:Cadastrar um usuário:
  Rota: /cadastrar-usuario
  Método: POST

  Função:Fazer login
  Rota: /login/:idUsuario
  Método: GET
   
  Função: Criar um recado
  Rota: /criarRecado/:idUsuario
  Método: POST
   
  Função: Listar recados
  Rota: /recados/:idUsuario
  Método: GET
   
  Função: Editar recado
  Rota: /recados/:idUsuario/:idRecado
  Método: PUT

  Função: Deletar recado
  Rota: /recados/:idUsuario/:idRecado
  Método:DELETE
   
  
  `)
})

//  ROTA CRIAR USUÁRIO 
app.post("/cadastrar-usuario",(req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;


  const novousuario = { nome, email, senha, idUsuario, recados, userlogged };

  if (nome === undefined || email === undefined || senha === undefined) {
    res.send(`Insira um dado válido. Veja o exemplo abaixo:

              { 
                "nome":"exemplo", 
                "email": "exemplo@email.com",
                "senha": "senha"
              }`);
  } 

 const emailEncontrado = usuariosCadastrados.find((usuario) => usuario.email === email);

 if (emailEncontrado) {
  res.send(`O e-mail: ${novousuario.email} já está cadastrado`)
 } else {
  usuariosCadastrados.push(novousuario);
  idUsuario++;
  res.send('Usuário cadastrado com sucesso')
 }
 console.log(usuariosCadastrados);
 console.log('------------------------------');

});

//ROTA LOGIN 
app.get("/login/:idUsuario", (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario); 

  const encontrarUsuario = usuariosCadastrados.find((usuario) => usuario.idUsuario === idUsuario);

  const { email, senha } = req.body;

  if (email === undefined || senha === undefined) {
    res.send(`Tentativa inválida!
      Forneça o id do usuário após a rota e no body(json) envie o email e a senha:

      {
        "email": "email@example.com",
        "senha": "123"
      }
    `);
  } else {
    if (encontrarUsuario) {
      if (encontrarUsuario.email === email && encontrarUsuario.senha === senha) {

        userlogged = encontrarUsuario.idUsuario
        console.log("--- Login efetuado ---");
        console.log(usuariosCadastrados);
        res.send('Login efetuado com sucesso');
        return 

      } else {
        res.status(404).json({ error: "Verifique as informações e tente novamente" });
      }
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
      
    }
  }
});

// Rota listar usuários cadastrados
app.get("/cadastrados", (req, res)=> {
  res.send(usuariosCadastrados)
})

//ROTA  CRIAR RECADOS 
app.post("/criarRecado/:idUsuario", verificarLogin, (req, res)=> {
  const idUsuario = parseInt(req.params.idUsuario); 
  const encontrarUsuario = usuariosCadastrados.find((usuario) => usuario.idUsuario === idUsuario);
  if(!encontrarUsuario){ res.send('Usuário não encontrado')}
  if(idUsuario !== userlogged ){
    res.status(404).json({ error: "Usuário não autorizado" });
  } else {
    const titulo = req.body.titulo
  const descricao = req.body.descricao
  const novoRecado = { titulo, descricao, idRecado, idUsuario}

  if (titulo === undefined || descricao === undefined) {
    res.send(`Insira um dado válido. Veja o exemplo abaixo:

              { 
                "titulo":"titulo1", 
                "descricao": "descricao1"
              }`);
  } else {
    idRecado++
    recados.push(novoRecado)
    res.send('Novo recado cadastrado com sucesso')
    console.log(recados);
    console.log(`----------------------`);
  }
  }


  
})

//Rota para LISTAR recados de um usuario 
app.get("/recados/:idUsuario", verificarLogin, (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);
  if(idUsuario !== userlogged ){
    res.status(404).json({ error: "Usuario não autorizado" });
  }

  const usuario = usuariosCadastrados.find((user) => user.idUsuario === idUsuario);
  const recadosDoUsuario = recados.filter((recado) => recado.idUsuario === idUsuario);

  if (!usuario) {
    res.status(404).json({ error: "Usuario não encontrado" });
  } else {

    res.status(200).json({ mensagem: "Recados encontrados", recados: recadosDoUsuario });
  }
});

//Rota para editar um recado pelo ID 
app.put("/recados/:idUsuario/:idRecado", verificarLogin,(req, res)=>{
  const idUsuario = req.params.idUsuario;
  const user = usuariosCadastrados.find((user) => user.idUsuario === parseInt(idUsuario));
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
  

  const id = req.params.idRecado;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  const recado = user.recados.find((recado) => recado.idRecado === parseInt(id));

  if(idUsuario == userlogged){
    if (!recado) {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  
    recado.titulo = titulo || recado.titulo;
    recado.descricao = descricao || recado.descricao;
  
    res.send({ mensagem: "Recado alterado", recado: recado });
    
  } if(idUsuario!== userlogged){
    res.status(404).json({ error: "Usuário não autorizado" });
  }

})

//Rota para deletar um recado pelo ID 
app.delete("/recados/:idUsuario/:idRecado",verificarLogin,(req, res) => {
  const idUsuario = req.params.idUsuario;
  const user = usuariosCadastrados.find((user) => user.idUsuario === parseInt(idUsuario));
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }


  const id = req.params.idRecado;
  const index = user.recados.findIndex((recado) => recado.idRecado === parseInt(id));

  if(idUsuario == userlogged){
      if (index === -1) {
        res.status(404).json({ error: "Usuário não encontrado" });
          return;
        }
      
        user.recados.splice(index, 1);
        res.send("Recado removido com sucesso!" + recados);
  }

  if(idUsuario !== userlogged ){
    res.status(404).json({ error: "Usuário não autorizado" });
  }

  

  
});

//Rota para Sair do CRUD
app.delete("/delete/:idUsuario", verificarLogin, (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario); 
  const user = usuariosCadastrados.find((user) => user.idUsuario === idUsuario);
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  if (idUsuario === userlogged) {
    const indexToRemove = usuariosCadastrados.findIndex((user) => user.idUsuario === idUsuario);
    usuariosCadastrados.splice(indexToRemove, 1);
    userlogged = undefined;

    return res.send("Usuário com o " + idUsuario +  " removido com sucesso!");
  }

  return res.status(401).json({ error: "Usuário " + idUsuario +" não autorizado" });
});


app.delete("/sair/:idUsuario", verificarLogin, (req, res)=>{
  const idUsuario = req.params.idUsuario;
  const user = usuariosCadastrados.find((user) => user.idUsuario === parseInt(idUsuario));
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }

  if(idUsuario !== userlogged ){
    res.status(404).json({ error: "Usuário não autorizado" });

  }

  if(idUsuario == userlogged){
      user.splice(usuariosCadastrados, 1);
      userlogged = undefined
      res.send("Usuario removido com sucesso!");
}
})

  
app.listen(3000, () => {
  console.log("Acesso a porta 3000 concuído com sucesso");
});


const express = require("express");
const app = express();
app.use(express.json());

const usuariosCadastrados = [];
let idUsuario = 0;
const recados = [];
let idRecado = 0;
var logado = false;

// Middleware para VERIFICAR se o usuário está logado
function verificarLogin(req, res, next) {
    if (logado) {
      next();
  } else {
    res.status(401).send('Acesso não autorizado. Faça o login primeiro.');
  }
}

//  ROTA CRIAR USUÁRIO - ok
app.post("/cadastrar-usuario",(req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;


  const novousuario = { nome, email, senha, idUsuario, recados, logado };

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

//ROTA LOGIN - ok
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
        
        logado=true
        encontrarUsuario.logado = true
        console.log("--- Login efetuado ---");
        console.log(usuariosCadastrados);
        res.send('Login efetuado com sucesso');
        return 

      } else {
        res.send('Verifique as informações e tente novamente');
      }
    } else {
      res.send('Usuário não encontrado');
    }
  }
});

//ROTA LISTAR USUARIOS CADASTRADOS - ok
app.get("/cadastrados", verificarLogin,(req, res)=> {
  res.json(usuariosCadastrados)
})

//ROTA  CRIAR RECADOS - ok 
app.post("/criarRecado/:idUsuario", verificarLogin, (req, res)=> {
  const idUsuario = parseInt(req.params.idUsuario); 
  const encontrarUsuario = usuariosCadastrados.find((usuario) => usuario.idUsuario === idUsuario);
  if(!encontrarUsuario){ res.send('Usuário não encontrado')}

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
})

//Rota para LISTAR recados de um usuario - ok 
app.get("/recados/:idUsuario", verificarLogin, (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);

  const usuario = usuariosCadastrados.find((user) => user.idUsuario === idUsuario);
  const recadosDoUsuario = recados.filter((recado) => recado.idUsuario === idUsuario);

  if (!usuario) {
    res.status(404).json({ error: "Usuario não encontrado" });
  } else {

    res.status(200).json({ mensagem: "Recados encontrados", recados: recadosDoUsuario });
  }
});

//Rota para editar um recado pelo ID -ok
app.put("/recados/:idUsuario/:idRecado", verificarLogin,(req, res)=>{
  const userId = req.params.idUsuario;
  const user = usuariosCadastrados.find((user) => user.idUsuario === parseInt(userId));
  if (!user) {
    res.status(404);
    res.send({ error: "Usuario não encontrado" });
  }

  const id = req.params.idRecado;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  const recado = user.recados.find((recado) => recado.idRecado === parseInt(id));

  if (!recado) {
    res.status(404);
    res.send({ error: "Recado não encontrado" });
  }

  recado.titulo = titulo || recado.titulo;
  recado.descricao = descricao || recado.descricao;

  res.send({ mensagem: "Recado alterado", recado: recado });
})

//Rota para deletar um recado pelo ID - ok
app.delete("/recados/:idUsuario/:idRecado",verificarLogin,(req, res) => {
  const userId = req.params.idUsuario;
  const user = usuariosCadastrados.find((user) => user.idUsuario === parseInt(userId));

  if (!user) {
    res.status(404);
    res.send({ error: "Usuario não encontrado" });
    return;
  }

  const id = req.params.idRecado;
  const index = user.recados.findIndex((recado) => recado.idRecado === parseInt(id));

  if (index === -1) {
    res.status(404);
    res.send({ error: "Recado não encontrado" });
    return;
  }

  user.recados.splice(index, 1);
  res.send("Recado removido com sucesso!" + recados);
});


app.listen(3000, () => {
  console.log("Acesso a porta 3000 concuído com sucesso");
});


const express = require("express");
const app = express();
app.use(express.json());

const cors = require ("cors")
app.use(cors())


let idUsuario = 100;
const recados = [{
  "titulo": "titulo - 1",
  "descricao": "descricao de titulo - 1",
  "idRecado": 79,
  "idUsuario": 11
},
{
  "titulo": "titulo0",
  "descricao": "descricao1",
  "idRecado": 80,
  "idUsuario": 10
},
{
  "titulo": "titulo0",
  "descricao": "descricao1",
  "idRecado": 81,
  "idUsuario": 10
},
{
  "titulo": "titulo0",
  "descricao": "descricao1",
  "idRecado": 82,
  "idUsuario": 10
},
{
  "titulo": "titulo1",
  "descricao": "descricao1",
  "idRecado": 83,
  "idUsuario": 10
},
{
  "titulo": "titulo1",
  "descricao": "descricao1",
  "idRecado": 84,
  "idUsuario": 10
},
{
  "titulo": "titulo1",
  "descricao": "descricao1",
  "idRecado": 85,
  "idUsuario": 10
},
{
  "titulo": "titulo1",
  "descricao": "descricao1",
  "idRecado": 96,
  "idUsuario": 10
},
{
  "titulo": "titulo1",
  "descricao": "descricao1",
  "idRecado": 97,
  "idUsuario": 10
},
{
  "titulo": "titulo1",
  "descricao": "descricao1",
  "idRecado": 98,
  "idUsuario": 10
},
{
  "titulo": "titulo1",
  "descricao": "descricao1",
  "idRecado": 99,
  "idUsuario": 10
}];
let idRecado = 100;
var userlogged;

const usuariosCadastrados = [{
  "nome":"João","email":"exemplojoao@email.com","senha":"senha","idUsuario":10,"recados": []},{
    "nome":"Pedro","email":"exemplopedro@email.com","senha":"1234","idUsuario":11,"recados": []}];


// Middleware para VERIFICAR se o usuário está logado
function verificarLogin(req, res, next) {
  if (userlogged) {
    next();
  } else {
    res.status(401).send("Acesso não autorizado. Faça o login primeiro.");
  }
}

app.get("/", (req, res) => {
  res.send(`Bem vindo a API Recados!
  
Abaixo estão as rotas e os métodos necessários!
  
Função: Cadastrar um usuário:
Rota: /cadastrar-usuario
Método: POST

Função: Fazer login
Rota: /login/:idUsuario
Método: POST

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

Função: Deletar perfil
Rota: /delete/:idUsuario
Método:DELETE


Função: Sair do perfil 
Rota: /sair/:idUsuario
Método:DELETE
 `);
});

//  ROTA CRIAR USUÁRIO
app.post("/cadastrar-usuario", (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;
  const novousuario = { nome, email, senha, idUsuario, recados };

  if (nome === undefined || email === undefined || senha === undefined) {
    res.status(401);
    res.send(`Insira um dado válido. Veja o exemplo abaixo:

              { 
                "nome":"exemplo", 
                "email": "exemplo@email.com",
                "senha": "senha"
              }`);
  }

  const emailEncontrado = usuariosCadastrados.find(
    (usuario) => usuario.email === email
  );

  if (emailEncontrado) {
    res.status(404).send(`O e-mail: ${novousuario.email} já está cadastrado`);
  } else {
    usuariosCadastrados.push(novousuario);
    idUsuario++;
    res.send(
      `Usuário cadastrado com sucesso! 
      
      O seu idUsuario é: ${novousuario.idUsuario}`
    );
  }
});

//ROTA LOGIN
app.post("/login/", (req, res) => {
  const { email, senha } = req.body;

  if (email === undefined || senha === undefined) {
    res.status(404).send(`Tentativa inválida!  Forneça o id do usuário após a rota e no body(json) envie o email e a senha:

    {
      "email": "exemplojoao@email.com",
      "senha": "senha"
      }`);
  } else {
    const usuarioEncontrado = usuariosCadastrados.find(
      (usuario) => usuario.email === email && usuario.senha === senha
    );

    if (usuarioEncontrado) {
      userlogged = usuarioEncontrado.idUsuario;
      return res.redirect("/recados/" + usuarioEncontrado.idUsuario);
      // return res.send("Login efetuado com sucesso");
    } else {
      return res.status(404).send(`ERRO: Verifique as informações e tente novamente`);
    }
  }
});


// Rota listar usuários cadastrados
// app.get("/cadastrados", (req, res) => {
//   res.send(usuariosCadastrados);
// });

//ROTA  CRIAR RECADOS
app.post("/criarRecado/:idUsuario", verificarLogin, (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);
  const encontrarUsuario = usuariosCadastrados.find(
    (usuario) => usuario.idUsuario === idUsuario
  );

  if (!encontrarUsuario) {
    return res.status(401).send(`Usuário não encontrado`);
  }
  if (idUsuario !== userlogged) {
    return res.status(401).send(`Usuário não autorizado`);
  } else {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const novoRecado = { titulo, descricao, idRecado, idUsuario };

    if (titulo === undefined || descricao === undefined) {
      res.status(404).send(`Insira um dado válido. Veja o exemplo abaixo:

              { 
                "titulo":"titulo1", 
                "descricao": "descricao1"
              }`);
    } else {
      idRecado++;
      recados.push(novoRecado);
      res.send("Novo recado cadastrado com sucesso");
    }
  }
});

//Rota para LISTAR recados de um usuario
app.get("/recados/:idUsuario", verificarLogin, (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);
  if (idUsuario !== userlogged) {
    return res.status(401).send(`Usuário não autorizado`);
  }

  const encontrarUsuario = usuariosCadastrados.find(
    (user) => user.idUsuario === idUsuario
  );
  if (!encontrarUsuario) {
    return res.status(401).send(`Usuário não encontrado`);
  }

  const recadosDoUsuario = recados.filter(
    (recado) => recado.idUsuario === idUsuario
  );

  // Paginação
  const page = parseInt(req.query.page) || 1; 
  const per_page = parseInt(req.query.per_page) || 5; 
  const startingPosition = (page - 1) * per_page;

  const recadosPaginados = recadosDoUsuario.slice(startingPosition, startingPosition + per_page);

  res.status(200).json({
  
    mensagem: "Recados encontrados",
    recados: recadosPaginados,
    id_do_usuario : encontrarUsuario.idUsuario, 
    email : encontrarUsuario.email, 
    nome : encontrarUsuario.nome, 
    pagina_atual: page,
    recados_por_pagina: per_page,
    total_recados: recadosDoUsuario.length,
    total_paginas: Math.ceil(recadosDoUsuario.length / per_page),
  });
});

//Rota para editar um recado pelo ID
app.put("/recados/:idUsuario/:idRecado", verificarLogin, (req, res) => {
  const idUsuario = req.params.idUsuario;
  const encontrarUsuario = usuariosCadastrados.find(
    (user) => user.idUsuario === parseInt(idUsuario)
  );
  if (!encontrarUsuario) {
    return res.status(401).send(`Usuário não encontrado`);
  }

  const id = req.params.idRecado;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  const recado = encontrarUsuario.recados.find(
    (recado) => recado.idRecado === parseInt(id)
  );

  if (idUsuario == userlogged) {
    if (!recado) {
      return res.status(401).send(`Recado não encontrado`);
    }

    recado.titulo = titulo || recado.titulo;
    recado.descricao = descricao || recado.descricao;

    res.send({ mensagem: "Recado alterado", recado: recado });
  }
  if (idUsuario !== userlogged) {
    return res.status(401).send(`Usuário não autorizado`);
  }
});

//Rota para deletar um recado pelo ID
app.delete("/recados/:idUsuario/:idRecado", verificarLogin, (req, res) => {
  const idUsuario = req.params.idUsuario;
  const encontrarUsuario = usuariosCadastrados.find(
    (user) => user.idUsuario === parseInt(idUsuario)
  );
  if (!encontrarUsuario) {
    return res.status(401).send(`Usuário não encontrado`);
  }

  const id = req.params.idRecado;
  const index = encontrarUsuario.recados.findIndex(
    (recado) => recado.idRecado === parseInt(id)
  );

  if (idUsuario == userlogged) {
    if (index === -1) {
      return res.status(401).send(`Recado não encontrado`);
    }

    encontrarUsuario.recados.splice(index, 1);
    res.send("Recado removido com sucesso!" + recados);
  }

  if (idUsuario !== userlogged) {
    return res.status(401).send(`Usuário não encontrado`);
  }
});

//Rota para deletar perfil do CRUD
app.delete("/delete/:idUsuario", verificarLogin, (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);
  const encontrarUsuario = usuariosCadastrados.find((user) => user.idUsuario === idUsuario);
  if (!encontrarUsuario) {
    return res.status(401).send(`Usuário não encontrado`);
  }

  if (idUsuario === userlogged) {
    const indexToRemove = usuariosCadastrados.findIndex(
      (user) => user.idUsuario === idUsuario
    );
    usuariosCadastrados.splice(indexToRemove, 1);
    userlogged = undefined;

    return res.send(`Usuário ${idUsuario} removido com sucesso!`);
  }
  return res.status(401).send(`Usuário ${idUsuario} não autorizado`);
});

// Rota sair do crud
app.delete("/sair/:idUsuario", verificarLogin, (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);
  const encontrarUsuario = usuariosCadastrados.find((user) => user.idUsuario === idUsuario);
  if (!encontrarUsuario) {
    return res.status(401).send(`Usuário não encontrado`);
  }

  if (idUsuario === userlogged) {
    userlogged = undefined;
    return res
      .status(201)
      .send(`Logout do usuário ${idUsuario} concluído com sucesso!`);
  }

  return res.status(401).send(`Usuário ${idUsuario} não autorizado`);
});

app.listen(3000, () => {
  console.log("Acesso a porta 3000 concuído com sucesso");
});

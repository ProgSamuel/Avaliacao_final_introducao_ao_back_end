function dados() {
  const idUsuario = parseInt(req.params.idUsuario);
  const encontrarUsuario = usuariosCadastrados.find(
    (usuario) => usuario.idUsuario === idUsuario
  );

  if (!encontrarUsuario) {
    return res.status(401).send(`Usuário não encontrado`);
  }
  if (idUsuario !== userlogged) {
    return res.status(401).send(`Usuário não autorizado`);
  }

  return{idUsuario, encontrarUsuario}

}
app.get("/recados/:idUsuario", verificarLogin, (req, res) => {
    entrada()
    const recadosDoUsuario = recados.filter(
      (recado) => recado.idUsuario === idUsuario
    );
  
    if(encontrarUsuario) {
      res
        .status(200)
        .json({ mensagem: "Recados encontrados", recados: recadosDoUsuario });
    }
  });

//ROTA  CRIAR RECADOS - ok
//Rota para LISTAR recados de um usuario - no
//Rota para editar um recado pelo ID
//Rota para deletar um recado pelo ID
//Rota para deletar perfil do CRUD
// Rota sair do crud

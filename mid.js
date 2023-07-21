// Middleware para VERIFICAR se o usuário está logado
function verificarLogin(req, res, next) {
    if (userlogged) {

        const idUsuario = parseInt(req.params.idUsuario); 
        const encontrarUsuario = usuariosCadastrados.find((usuario) => usuario.idUsuario === idUsuario);

        if(!encontrarUsuario){ res.status(404).json({ error: "Usuario não encontrado" });}

        if(idUsuario !== userlogged ){
            res.status(404).json({ error: "Usuario não autorizado" });
          }

      next();
  } else {
    res.status(401).send('Acesso não autorizado. Faça o login primeiro.');
  }
}

// Middleware para VERIFICAR se o usuário está logado
function verificarLogin(req, res, next) {
    if (userlogged) {
        const idUsuario = parseInt(req.params.idUsuario); 
        const encontrarUsuario = usuariosCadastrados.find((usuario) => usuario.idUsuario === idUsuario);

        if(!encontrarUsuario){ res.status(404).json({ error: "Usuario não encontrado" });}
      next();
  } else {
    res.status(401).send('Acesso não autorizado. Faça o login primeiro.');
  }
}

//criar - ok 
// listar - ok
// editar - ok
// deletar
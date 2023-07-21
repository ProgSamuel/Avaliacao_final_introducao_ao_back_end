//Rota para deletar um recado pelo ID 
app.delete("/recados/:idUsuario/:idRecado",verificarLogin,(req, res) => {
  const idUsuario = req.params.idUsuario;
  const user = usuariosCadastrados.find((user) => user.idUsuario === parseInt(idUsuario));
  if (!user) {
    res.status(404);
    res.send({ error: "Usuario não encontrado" });
  }


  const id = req.params.idRecado;
  const index = user.recados.findIndex((recado) => recado.idRecado === parseInt(id));

  if(idUsuario == userlogged){
      if (index === -1) {
          res.status(404);
          res.send({ error: "Recado não encontrado" });
          return;
        }
      
        user.recados.splice(index, 1);
        res.send("Recado removido com sucesso!" + recados);
  }

  if(idUsuario !== userlogged ){
    res.send('Usuário não autorizado')
  }

});

app.delete("/delete/:idUsuario", verificarLogin, (req, res)=>{
  const idUsuario = req.params.idUsuario;
  const user = usuariosCadastrados.find((user) => user.idUsuario === parseInt(idUsuario));
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }

  if(idUsuario !== userlogged ){
    res.status(404).json({ error: "Usuário não autorizado" });

  }

  if(idUsuario == userlogged){
      user.recados.splice(usuariosCadastrados, 1);
      userlogged = undefined
      res.send("Usuario removido com sucesso!");
}
})
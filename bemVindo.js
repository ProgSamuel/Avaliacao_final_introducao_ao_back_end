
export function bemVindo (){
    const BemVindo = {"Bem Vindo": "Bem vindo a API Recados!"}
    const rotas = ["Rotas:"]
    const conteudo = [ {
        "Função": "Cadastrar um usuário",
        "Rota": "/cadastrar-usuario",
        "Método": "POST"
      },
      {
        "Função": "Fazer login",
        "Rota": "/login/:idUsuario",
        "Método": "GET"
      },
      {
        "Função": "Criar um recado",
        "Rota": "/criarRecado/:idUsuario",
        "Método": "POST"
      },
      {
        "Função": "Listar recados",
        "Rota": "/recados/:idUsuario",
        "Método": "GET"
      },
      {
        "Função": "Editar recado",
        "Rota": "/recados/:idUsuario/:idRecado",
        "Método": "PUT"
      },
      {
        "Função": "Deletar recado",
        "Rota": "/recados/:idUsuario/:idRecado",
        "Método": "DELETE"
      },
      {
        "Função": "Deletar perfil",
        "Rota": "/delete/:idUsuario",
        "Método": "DELETE"
      },
      {
        "Função": "Sair do perfil",
        "Rota": "/sair/:idUsuario",
        "Método": "DELETE"
      }]}

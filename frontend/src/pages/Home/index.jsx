import api from "../../services/api"; // Importa a instância axios configurada para chamar a API
import { useEffect, useState, useRef } from "react"; // Hooks do React
import "./style.css"; // Estilos da página

function Home() {
  // Estado para armazenar a lista de usuários obtida da API
  const [users, setUsers] = useState([]);

  // Referências para acessar diretamente os inputs do formulário
  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  // Função para buscar usuários do backend
  async function getUsers() {
    try {
      // Requisição GET para /usuarios
      const usersFromApi = await api.get("/usuarios");
      console.log("Usuários recebidos:", usersFromApi.data);
      // Atualiza o estado com os usuários recebidos
      setUsers(usersFromApi.data);
    } catch (error) {
      // Tratamento de erro caso a requisição falhe
      console.error("Erro ao buscar usuários:", error);
    }
  }

  // Função para criar um novo usuário
  async function createUsers() {
    try {
      // Envia dados do formulário via POST para a API
      await api.post("/usuarios", {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value,
      });

      // Limpa os campos do formulário após o envio
      inputName.current.value = "";
      inputAge.current.value = "";
      inputEmail.current.value = "";

      // Atualiza a lista de usuários após a criação
      getUsers();
    } catch (error) {
      // Tratamento de erro na criação de usuário
      console.error("Erro ao criar usuário:", error);
    }
  }

  // Função para deletar um usuário pelo id
  async function deleteUsers(id) {
    try {
      // Envia requisição DELETE para a API
      await api.delete(`/usuarios/${id}`);
      // Atualiza a lista após exclusão
      getUsers();
    } catch (error) {
      // Tratamento de erro na exclusão
      console.error("Erro ao deletar usuário:", error);
    }
  }

  // useEffect para executar a busca dos usuários assim que o componente carregar (montar)
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Usuários</h1>
        {/* Inputs controlados via ref para capturar dados do formulário */}
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="text" ref={inputAge} />
        <input
          placeholder="E-mail"
          name="email"
          type="email"
          ref={inputEmail}
        />
        {/* Botão para cadastrar, que chama a função createUsers */}
        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>
      <div>
        {/* Mapeia a lista de usuários e exibe cards com informações */}
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="card-info">
              <p>
                Nome: <span>{user.name}</span>
              </p>
              <p>
                Idade: <span>{user.age}</span>
              </p>
              <p>
                E-mail: <span>{user.email}</span>
              </p>
            </div>

            {/* Botão para deletar usuário */}
            <button
              className="trash-button"
              onClick={() => deleteUsers(user.id)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                alt="imagem_de_lixeira"
                width="24"
                height="24"
              />
            </button>
          </div>
        ))}
      </div>
      <div className="pop-alert">
        <span>
          ⚡ Este site pode levar até 60 segundos para se conectar ao backend
          devido a sua hospedagem... Por favor, aguarde... 💬
        </span>
      </div>
    </div>
  );
}

export default Home;

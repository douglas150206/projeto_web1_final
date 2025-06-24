const cadastroForm = document.getElementById('cadastro-form');
    const loginForm = document.getElementById('login-form');
    const toggleForm = document.getElementById('toggle-form');
    const formTitle = document.getElementById('form-title');
    const msg = document.getElementById('msg');

    let isCadastro = true;

    function showMessage(text, success = false) {
      msg.textContent = text;
      msg.className = "message" + (success ? " success" : "");
      setTimeout(() => { msg.textContent = ""; }, 3000);
    }

    toggleForm.onclick = () => {
      isCadastro = !isCadastro;
      cadastroForm.style.display = isCadastro ? "block" : "none";
      loginForm.style.display = isCadastro ? "none" : "block";
      formTitle.textContent = isCadastro ? "Cadastro" : "Login";
      toggleForm.textContent = isCadastro
        ? "Já tem conta? Faça login"
        : "Não tem conta? Cadastre-se";
      msg.textContent = "";
    };

    cadastroForm.onsubmit = function(e) {
      e.preventDefault();
      const username = document.getElementById('cad-username').value.trim();
      const password = document.getElementById('cad-password').value.trim();

      if (!username || !password) {
        showMessage('Preencha todos os campos.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[username]) {
        showMessage('Usuário já cadastrado.');
        return;
      }

      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));
      showMessage('Cadastro realizado com sucesso!', true);
      cadastroForm.reset();
    };

    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const username = document.getElementById('log-username').value.trim();
      const password = document.getElementById('log-password').value.trim();

      const users = JSON.parse(localStorage.getItem('users') || '{}');

      if (!users[username]) {
        showMessage('Usuário não encontrado.');
        return;
      }

      if (users[username] === password) {
        showMessage('Login realizado com sucesso!', true);
        window.location.href = 'home.html'; 
      } else {
        showMessage('Senha incorreta.');
      }
    };
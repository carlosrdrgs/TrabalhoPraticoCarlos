document.addEventListener('DOMContentLoaded', function() {
    var elemsCollapsible = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elemsCollapsible);

    var elemsSidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elemsSidenav);
});

var dadosEstudantes = [];
var alunosExcluidos = [];

var cadastrar = document.querySelector('.cadastrar');
var listar = document.querySelector('.listar');
var lixeira = document.querySelector('.lixeira');
var btnsubmit = document.querySelector('.buttonCarregar');
var lista = document.querySelector('.lista');
var lixeiraConteudo = document.querySelector('.collapsible-body .lixeira');
var esvaziarLixeira = document.querySelector('.esvaziarLixeira');

listar.onclick = function() {
    lista.innerHTML = '';
    for (var i = 0; i < dadosEstudantes.length; i++) {
        var estudante = dadosEstudantes[i];
        var listaItem = document.createElement('div');
        listaItem.innerHTML = '<h2>' + estudante.nome + '</h2><button onclick="excluirAluno(' + i + ')">Excluir</button><button onclick="editarAluno( ' + i + ')">Editar</button>' + '<br>Idade: ' + estudante.idade + '<br>Curso: ' + estudante.curso + '<br>Turno: ' + estudante.turno + '<br>Matriculado: ' + estudante.matriculado + '<br>CEP: ' + estudante.cep + '<br>Logradouro: ' + estudante.logradouro + '<br>Bairro: ' + estudante.bairro + '<br>Localidade: ' + estudante.localidade + '<br>UF: ' + estudante.uf;
        lista.appendChild(listaItem);
    }
};

btnsubmit.onclick = function(event) {
    event.preventDefault();

    var nome = document.querySelector('#nome').value.trim();
    var idade = parseInt(document.querySelector('#idade').value);
    var curso = document.querySelector('#curso').value.trim();
    var turno = document.querySelector('input[name="turno"]:checked').value;
    var matriculado = document.querySelector('input[name="matriculado"]:checked').value;
    var cep = document.querySelector('#cep').value.trim();

    if (nome.length < 10 || nome.split(' ').length < 2) {
        M.toast({html: "O nome deve ter pelo menos 10 caracteres e 2 palavras.", classes: 'red darken-2'});
        return;
    }

    if (idade < 1 || idade > 150) {
        M.toast({html: "A idade deve estar entre 1 e 150.", classes: 'red darken-2'});
        return;
    }

    if (curso.length < 3) {
        M.toast({html: "O curso deve ter pelo menos 3 caracteres.", classes: 'red darken-2'});
        return;
    }

    consultaCep(cep, function(cepData) {
        if (cepData.erro) {
            M.toast({html: "CEP inválido.", classes: 'red darken-2'});
            return;
        }

        var estudante = { nome: nome, idade: idade, curso: curso, turno: turno, matriculado: matriculado, cep: cep, logradouro: cepData.logradouro, bairro: cepData.bairro, localidade: cepData.localidade, uf: cepData.uf };

        dadosEstudantes.push(estudante);
        M.toast({html: "Aluno cadastrado com sucesso!", classes: 'green darken-2'});
        console.log(dadosEstudantes);
    });
};

function excluirAluno(aux) {
    var estudante = dadosEstudantes[aux];
    alunosExcluidos.push(estudante);
    dadosEstudantes.splice(aux, 1);
    listar.click();
    atualizarLixeira();
    M.toast({html: "Aluno movido para a lixeira.", classes: 'yellow darken-2'});
}

function editarAluno(index) {
    if (confirm('Deseja realmente alterar este aluno?')) {
        let aluno = dadosEstudantes[index];

        let nome = prompt("Novo nome do aluno:", aluno.nome);
        let idade = prompt("Nova idade do aluno:", aluno.idade);
        let curso = prompt("Novo curso do aluno:", aluno.curso);
        let turno = prompt("Novo turno do aluno:", aluno.turno);
        let matriculado = prompt("Novo status de matrícula do aluno:", aluno.matriculado);
        let cep = prompt("Novo CEP do aluno:", aluno.cep);

        let mensagemErro = '';

        if (nome.length < 10 || nome.split(' ').length < 2) {
            mensagemErro += 'O nome deve ter pelo menos 10 caracteres e 2 palavras.\n';
        }
        if (parseInt(idade) < 1 || parseInt(idade) > 150) {
            mensagemErro += 'A idade deve estar entre 1 e 150.\n';
        }
        if (curso.length < 3) {
            mensagemErro += 'O curso deve ter pelo menos 3 caracteres.\n';
        }

        if (mensagemErro) {
            alert("Erro ao editar o aluno:\n" + mensagemErro);
        } else {
            dadosEstudantes[index].nome = nome;
            dadosEstudantes[index].idade = parseInt(idade);
            dadosEstudantes[index].curso = curso;
            dadosEstudantes[index].turno = turno;
            dadosEstudantes[index].matriculado = matriculado;
            dadosEstudantes[index].cep = cep;

            listar.click(); 
            M.toast({html: "Aluno editado com sucesso!", classes: 'green darken-2'});
        }
    }
}


function atualizarLixeira() {
    lixeiraConteudo.innerHTML = '';
    if (alunosExcluidos.length > 0) {
        for (var i = 0; i < alunosExcluidos.length; i++) {
            var aluno = alunosExcluidos[i];
            var lixeiraItem = document.createElement('div');
            lixeiraItem.innerHTML = '<h2>' + aluno.nome + '</h2>' + '<br><button onclick="recuperarAluno(' + i + ')">Recuperar</button>' +  '<br>Idade: ' + aluno.idade + '<br>Curso: ' + aluno.curso + '<br>Turno: ' + aluno.turno + '<br>Matriculado: ' + aluno.matriculado + '<br>CEP: ' + aluno.cep + '<br>Logradouro: ' + aluno.logradouro + '<br>Bairro: ' + aluno.bairro + '<br>Localidade: ' + aluno.localidade + '<br>UF: ' + aluno.uf;
            lixeiraConteudo.appendChild(lixeiraItem);
        }
    } 
}

function recuperarAluno(local) {
    var estudante = alunosExcluidos[local];
    dadosEstudantes.push(estudante);
    alunosExcluidos.splice(local, 1);
    atualizarLixeira();
    listar.click();
    M.toast({html: "Aluno recuperado da lixeira.", classes: 'green darken-2'});
}

esvaziarLixeira.onclick = function(){
    alunosExcluidos = [];
    atualizarLixeira();
    M.toast({html: "Lixeira esvaziada.", classes: 'green darken-2'});
}

function consultaCep(cep, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
            var resp_obj = JSON.parse(req.responseText);
            callback(resp_obj);
        }
    }
    req.open('GET', 'https://viacep.com.br/ws/' + cep + '/json');
    req.send();
}

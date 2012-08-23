// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players."

Nomes = new Meteor.Collection("nomes");
Chat = new Meteor.Collection("chat");

if (Meteor.is_client) {
  Template.entrada.entrou = function() {
    if(Session.get('entrou')){
      return true;
    }
    return false;
  };

  Template.entrada.nome = function() {
    return Session.get('nome');
  };

  Template.entrada.chat = function() {
    return Chat.find({});
  };

  Template.entrada.scroll_to_bottom = function() {
    Meteor.defer(function() {
      try{
        var chat = document.getElementById('chat');
        chat.scrollTop = chat.scrollHeight;
      } catch(err) {
        console.log(err);
      }
    });
  }
  
  Template.entrada.events = {
    'click button.entrar': function() {
      var nome = document.getElementById('nome').value.trim();
      if(Validation.nome_valido(nome)){
        Nome.set_nome(nome);
        Session.set('entrou', true);
        Session.set('nome', nome);
        Chat.insert({user: Session.get('nome'), msg: 'Entrou na sala...'});
      } else {
        alert(Validation.get_erro());
      }
    },
    'click button#enviar': function() {
      var msg = document.getElementById('msg').value.trim();
      Chat.insert({user: Session.get('nome'), msg: msg});
     }
  };

  Nome = {
    clear_nome: function(nome) {
      return Nomes.remove({nome: nome});
    },
    get_nome: function(nome) {
      return Nomes.findOne({nome: nome});
    },
    set_nome: function(nome) {
      return Nomes.insert({nome: nome});
    }
  };

  Validation = {
    get_erro: function(msg) {
      return Session.get('erro');
    },
    set_erro: function(msg) {
      return Session.set('erro', msg);
    },
    clear_erro: function() {
      return Session.set('erro', undefined);
    },
    nome_valido: function(nome) {
      this.clear_erro();
      if(nome.length == 0) {
        this.set_erro('Nome nao pode ser vazio');
        return false;
      }
      if(Nome.get_nome(nome)) {
        this.set_erro('Nome ja esta sendo usado');
        return false;
      }
      return true;
    }      
  };
      
}

// On server startup, create some players if the database is empty.
if (Meteor.is_server) {
  Meteor.startup(function () {
    Nomes.remove({});
  });
}

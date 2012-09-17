// Collections
Nomes = new Meteor.Collection("nomes");
Msgs = new Meteor.Collection("msgs");
Salas = new Meteor.Collection("salas");

Msg = {
    diz : function(nome, action, msg) {
        return Msgs.insert({
            user : nome,
            action : action,
            msg : msg,
            sala : Session.get('sala')
        });
    },
};

Nome = {
    remove : function(nome) {
        return Nomes.remove({
            nome : nome
        });
    },
    get : function(nome) {
        return Nomes.findOne({
            nome : nome
        });
    },
    set : function(nome) {
        return Nomes.insert({
            nome : nome
        });
    }
};

Sala = {
    set : function(nome) {
        return Salas.insert({
            nome : nome
        });
    }
}

Validation = {
    get_erro : function(msg) {
        return Session.get('erro');
    },
    set_erro : function(msg) {
        return Session.set('erro', msg);
    },
    clear_erro : function() {
        return Session.set('erro', undefined);
    },
    nome_valido : function(nome) {
        this.clear_erro();
        if (nome.length == 0) {
            this.set_erro('Nome nao pode ser vazio');
            return false;
        }
        if (Nome.get(nome)) {
            this.set_erro('Nome ja esta sendo usado');
            return false;
        }
        return true;
    }
};

if (Meteor.is_client) {
    jQuery(window).unload(function() {
        Meteor.call('sair', Session.get('nome'));
        console.log('bla');
    });

    Template.entrada.msgs = function() {
        return Msgs.find({
            'sala' : Session.get('sala')
        });
    };

    Template.entrada.salas = function() {
        return Salas.find({});
    };

    Template.entrada.usuarios = function() {
        return Nomes.find({});
    };

    Template.entrada.entrou = function() {
        if (Session.get('entrou')) {
            return true;
        }
        return false;
    };

    Template.entrada.scroll_to_bottom = function() {
        Meteor.defer(function() {
            try {
                var chat = document.getElementById('chat');
                chat.scrollTop = chat.scrollHeight;
            } catch(err) {
                console.log(err);
            }
        });
    };

    Template.entrada.events = {
        'click button#cria-sala' : function(e) {
            var nome = document.getElementById('nome-sala').value.trim();
            Sala.set(nome);
        },
        'click a.entrar' : function() {
            var nome = document.getElementById('nome-usuario').value.trim();
            var nome_sala = this.nome;
            if (Validation.nome_valido(nome)) {
                Nome.set(nome);
                Session.set('entrou', true);
                Session.set('nome', nome);
                Session.set('sala', nome_sala);
                Msg.diz(nome, ': ', 'Entrou na sala...', nome_sala);
            } else {
                alert(Validation.get_erro());
            }
        },
        'click button#enviar' : function() {
            var msg = document.getElementById('msg').value.trim();
            Msg.diz(Session.get('nome'), ' disse: ', msg);
        }
    };
}

if (Meteor.is_server) {
    Meteor.startup(function() {
        // Nomes.remove({});
    });
    Meteor.methods({
        sair : function(nome) {
            return Nome.remove(nome);
            this.unblock();
        }
    });
}

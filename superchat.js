// Collections
Nomes = new Meteor.Collection("nomes");
Msgs = new Meteor.Collection("msgs");
Salas = new Meteor.Collection("salas");

get_parent_param = function(){
    // This is used when inside an iframe
    var parent;
    try{
        parent = get_params()['parent'];
    } catch(err) {
    }
    return parent ? parent : window.location.hostname;
}

get_params = function(){
    var params = window.location.href.split('?'),
        params_dict = Object(),
        p_split;
    if (params.length == 2){
        params = params[1].split('&');
        for(var i in params){
            if (params.hasOwnProperty(i)){
                p_split = params[i].split('=');
                params_dict[p_split[0]] = p_split[1];
            }
        }
    }
    return params_dict;
}

Msg = {
    diz : function(nome, action, msg) {
        return Msgs.insert({
            user : nome,
            action : action,
            msg : msg,
            sala : Session.get('sala'),
            host: PARENT
        });
    },
};

Nome = {
    remove : function(nome, sala) {
        return Nomes.remove({
            nome : nome,
            sala : sala,
            host : PARENT
        });
    },
    get : function(nome, sala) {
        return Nomes.findOne({
            nome : nome,
            sala : sala,
            host : PARENT
        });
    },
    set : function(nome, sala) {
        return Nomes.insert({
            nome : nome,
            sala : sala,
            host : PARENT
        });
    }
};

Sala = {
    set : function(nome) {
        return Salas.insert({
            nome : nome,
            host : PARENT
        });
    },
    get : function(nome) {
        return Salas.findOne({
            nome : nome,
            host : PARENT
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
    nome_valido : function(nome, sala) {
        this.clear_erro();
        if (nome.length == 0) {
            this.set_erro('Nome nao pode ser vazio');
            return false;
        }
        if (Nome.get(nome, sala)) {
            this.set_erro('Nome ja esta sendo usado');
            return false;
        }
        return true;
    },
    sala_valida : function(nome) {
        this.clear_erro();
        if (nome.length == 0) {
            this.set_erro('Nome da sala nao pode ser vazio');
            return false;
        }
        if (Sala.get(nome)) {
            this.set_erro('Nome da sala ja esta sendo usado');
            return false;
        }
        return true;
    }
};

if (Meteor.is_client) {
    var PARENT = get_parent_param();
    // jQuery(window).unload(function() {
    window.onbeforeunload = function(){
        // This does not work :(
        // Meteor.call('sair', Session.get('nome'), Session.get('sala'));
        var teste = Nome.remove(Session.get('nome'), Session.get('sala'));
        // var teste = 'teste';
        return teste.toString();
    };
    
    Template.entrada.msgs = function() {
        return Msgs.find({
            sala : Session.get('sala'),
            host : PARENT
        });
    };

    Template.entrada.salas = function() {
        return Salas.find({
            host : PARENT
        });
    };

    Template.entrada.usuarios = function() {
        return Nomes.find({
            host : PARENT
        });
    };

    Template.entrada.entrou = function() {
        if (Session.get('entrou')) {
            return true;
        }
        return false;
    };
    
    Template.entrada.sala_atual = function() {
        return Session.get('sala');
    }

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

    enviar_msg = function(e) {
        e = e || event;
        if ((e.keyCode || event.which || event.charCode || 0) == 13 ||
            e.type == 'click') {
            var $msg_box = document.getElementById('msg');
            var msg = $msg_box.value.trim();
            Msg.diz(Session.get('nome'), ' disse: ', msg);
            $msg_box.value = ''; 
        }
    };

    Template.entrada.events = {
        'click button#cria-sala' : function(e) {
            var nome = document.getElementById('nome-sala').value.trim();
            if (Validation.sala_valida(nome))
                Sala.set(nome);
        },
        'click a.entrar' : function() {
            var sala = this.nome;
            var nome = document.getElementById('nome-usuario').value.trim();
            if (Validation.nome_valido(nome, sala)) {
                Nome.set(nome, sala);
                Session.set('entrou', true);
                Session.set('nome', nome);
                Session.set('sala', sala);
                Msg.diz(nome, ': ', 'Entrou na sala...', sala);
            } else {
                alert(Validation.get_erro());
            }
        },
        'click button#enviar' : enviar_msg,
        'keydown #msg': enviar_msg
    };
}

if (Meteor.is_server) {
    Meteor.startup(function() {
        Nomes.remove({}); // Workaround to remove names from list
    });
    Meteor.methods({
        sair : function(nome, sala) {
            // This does not work :(
            this.unblock();
            return Nome.remove(nome, sala);
            
        }
    });
}

class ChatEngine{
    constructor(chatBoxId,userEmail,userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        this.socket = io.connect("http://localhost:5000",{
            transport: ['websocket'],
            withCredentials: true,
            extraHeaders: {
                "sockets": "abcd"
             }
        });

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect',function(){
            console.log('connection established using sockets....!');

            self.socket.emit('join_room',{
                user_email: self.userEmail,
                user_name: self.userName,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined',function(data){
                console.log('a user joined',data);
            });

            $('#send-message').click(function(){
                let msg = $('#chat-message-input').val();

                //added for automatic bottom scroll as new message arrives..
                $("#chat-messages-list").stop().animate({ scrollTop: $("#chat-messages-list")[0].scrollHeight}, 200);

                if(msg != ''){
                    self.socket.emit('send_message',{
                        message: msg,
                        user_email: self.userEmail,
                        user_name: self.userName,
                        chatroom: 'codeial'
                    });
                }
            });

            self.socket.on('recieve_message',function(data){
                console.log('message recieved',data.message);

                let newMessage = $('<li>');

                let messageType = 'other-message';

                if(data.user_email == self.userEmail){
                    messageType = 'self-message';
                }

                newMessage.append($('<span>',{
                    'html': data.message
                }));

                newMessage.append($('<br>'));

                newMessage.append($('<sub>',{
                    'html' : data.user_name
                }));

                newMessage.addClass(messageType);

                $('#chat-messages-list').append(newMessage);
            });

        });
    }
}
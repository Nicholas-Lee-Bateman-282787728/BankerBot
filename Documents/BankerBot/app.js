// This loads the environment variables from the .env file

require('dotenv-extended').load();


var builder = require('botbuilder');
var restify = require('restify');
            //var Store = require('./store');
            //var spellService = require('./spell-service');

            // Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);


//greet msg
bot.dialog('greet', function (session,args) {
        var greetEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'greetings');

    session.send('Hello there, I am version 1.0 of the Bankerbot.I can deal with many banking related stuff. Type \'help me\' for any assistance');
}).triggerAction({
    matches:'greet'
});

bot.dialog('Account Balance',[
    function (session, args) {
    // try extracting entity

        var balanceEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'balance');
        if (balanceEntity) {
             session.send('We are analyzing your message: \'%s\'', session.message.text);
                session.send('Your balance is ₹56000');

        }
    }]).triggerAction({
    matches: 'Account Balance'
            //onInterrupted: function (session) {
            //session.send('what else can i do for you?');
            // }
});

bot.dialog('mini statement',[
    function(session,args){
    // try extracting entity

    //var str = "this";
    //var result = str.link("http://i59.tinypic.com/9r28id.jpg");

        var miniStatementEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'miniStatement');
        if(miniStatementEntity){
            
            //session.send(' click '+ result+ ' link to redirect to your mini statement.');
            session.send(`------------------------
             a/c no.  date   time   debit  bal 
             ...............................
             xxx101   12/1   12:10  200    65000 
             xxx101   04/2   17:45  5000   60000
             xxx101   12/4   15:11  4000   56000

             -----------------------------`)
            
        }

    }
]).triggerAction({
    matches:'mini statement'
})



bot.dialog('help',[
    function(session,args){
    // try extracting entity
       var helpEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'help');
        if(helpEntity){
        session.send('I can help you knowing your balance information about your credit card, issuing checkbook, transfering funds, etc ')
        session.send('So how can I help you?')
        }
    }
]).triggerAction({
    matches: 'help'
})

bot.dialog('fundTransfer',[
    function(session,args,next){
        var rupeesEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'rupees');
        var nameEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'name'); 
         if (rupeesEntity) {
            // rupees entity detected, continue to next step
            session.dialogData.searchType = 'rupees';
            next({ response: rupeesEntity.entity });
        } else if(nameEntity){
            // name entity detected, continue to next step
            session.dialogData.searchType = 'name';
            next({ response: nameEntity.entity });
        }else{
            // no entities detected, ask user for a destination
            builder.Prompts.text(session, 'Please enter the amount to transfer');
        }
       
    },
        


    function (session, results) {
        var amount = results.response;

        var message = 'Successfully ';
        if (session.dialogData.searchType === 'rupees') {
            message += '  transfered %s';
        } else{
            message +=  '  transfered %s';
        }

            session.send(message, amount);

     }
     ]).triggerAction({
    matches:'fundTransfer'
})


    //  function(session,args,next){
    //     
    //      if (nameEntity) {

    //     } else {
    //         // no entity detected, ask user to whom to transfer
    //         builder.Prompts.text(session, 'to whom?');
    //     }
         
        
    //  },
    //  function (session, results) {
    //     var toPerson=results.response;

    //     var message2='Successfully'
    //      if(session.dialogData.searchType === 'name'){

    //         message2 += '  transfered to %s!';
    //         session.send(message2, toPerson);
    //     }

    //  }

bot.dialog('orderChequebook',[
    function(session,args){
        var orderChequebookEnitiy=builder.EntityRecognizer.findEntity(args.intent.entities, 'chequebook');
        if(orderChequebookEnitiy){
            session.send('We are analyzing your message: \'%s\'', session.message.text);
            session.send('Chequebook ordered successfully, it will arrive at your address within 2-3 working days.')

        }
    }
]).triggerAction({
    matches:'orderChequebook'
})


bot.dialog('paybills',[
    function(session,args,next){
        var mobileEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'mobile');
        var electricityEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'electricity');
        if(mobileEntity){
           // mobile entity detected, continue to next step
            session.dialogData.searchType = 'mobile';
            next({ response: mobileEntity.entity });
        }
        else if(electricityEntity){
           // electricity entity detected, continue to next step
            session.dialogData.searchType = 'electricity';
            next({ response: electricityEntity.entity });
        }
        else{
             // no entities detected, ask user for a which bill
            builder.Prompts.text(session, `which bills to pay? \n 1) Electricity \n 2) Mobile`);

        }
    },
    function (session, results) {
        var bill = results.response;
        var pay='how much amount?';
        var msg='';
        if(session.dialogData.searchType === 'mobile'){
             
            msg+='%s bill paid successfully'
        }else{
            msg+='%s bill paid successfully'
        }
        session.send(msg,bill);
    }



]).triggerAction({
    matches: 'paybills',

})
//--------------------------------------------------------------------

//--------------------------------------------------------------------------------
bot.dialog('creditcardBal', [

    function(session,args){
        var creditcardEntity=builder.EntityRecognizer.findEntity(args.intent.entities, 'creditcard');
        if(creditcardEntity){

          session.send(' Your credit card balance is Rs.40000  ')
        }
    }
]).triggerAction({
    matches:'creditcardBal'
})


bot.dialog('creditcardDue', [

    function(session,args){
        var ccdueEntity=builder.EntityRecognizer.findEntity(args.intent.entities, 'ccdue');
        if(ccdueEntity){
            session.send(' Your credit card due is Rs.10000  ')
        }
    }
]).triggerAction({
    matches:'creditcardDue'
})


/** This is a sample code for your bot**/
function MessageHandler(context, event) {
    // var nlpToken = "xxxxxxxxxxxxxxxxxxxxxxx";//Your Dialogflow token
    // context.sendResponse(JSON.stringify(event));
    sendMessageToApiAi({
        message : event.message,
        sessionId : new Date().getTime() +'api',
        nlpToken : "",
        callback : function(res){
            //Sample response from apiai here.
            context.sendResponse(JSON.parse(res).result.fulfillment.speech);
        }
    },context)
}

function sendMessageToApiAi(options,botcontext) {
    var message = options.message; // Mandatory
    var sessionId = options.sessionId || ""; // optinal
    var callback = options.callback;
    if (!(callback && typeof callback == 'function')) {
       return botcontext.sendResponse("ERROR : type of options.callback should be function and its Mandatory");
    }
    var nlpToken = options.nlpToken;
    
    if (!nlpToken) {
       if (!botcontext.simpledb.botleveldata.config || !botcontext.simpledb.botleveldata.config.nlpToken) {
           return botcontext.sendResponse("ERROR : token not set. Please set Api.ai Token to options.nlpToken or context.simpledb.botleveldata.config.nlpToken");
       } else {
           nlpToken = botcontext.simpledb.botleveldata.config.nlpToken;
       }
    }
    var query = '?v=20150910&query='+ encodeURIComponent(message) +'&sessionId='+sessionId+'&timezone=Asia/Calcutta&lang=en    '
    var apiurl = "https://api.api.ai/api/query"+query;
    var headers = { "Authorization": "Bearer " + nlpToken};
    botcontext.simplehttp.makeGet(apiurl, headers, function(context, event) {
       if (event.getresp) {
           callback(event.getresp);
       } else {
           callback({})
       }
    });
}

/** Functions declared below are required **/
function EventHandler(context, event) {
    if (!context.simpledb.botleveldata.numinstance)
        context.simpledb.botleveldata.numinstance = 0;
    numinstances = parseInt(context.simpledb.botleveldata.numinstance) + 1;
    context.simpledb.botleveldata.numinstance = numinstances;
    context.sendResponse("Thanks for adding me. You are:" + numinstances);
}

function HttpResponseHandler(context, event) {
    // if(event.geturl === "http://ip-api.com/json")
    context.sendResponse(event.getresp);
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
// Conversation states
let state = "ASK_NAME";
let leadName = "";
let leadEmail = "";
let leadCompany = "";
let accessToken = "6Cel800DHp000001tKCi888Hp0000005mCwGS5jOh3MGTnZJlWbBSMeYuiG6FDCPlDhG2Q0eQdAsZWziEfyMpnyhkVXR0Y1mSWTECpelZjk";

function updateChatbox(message) {
    var chatLog = document.getElementById("chatbox");
    chatLog.innerHTML += "<div>" + message + "</div>";
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the latest message
}

window.onload = function() {
    initiateConversation();
};

function initiateConversation() {
    if (state === "ASK_NAME") {
        updateChatbox("Bot: Hello! What's your name?");
    }
    // Other states can be handled here as needed
}

function sendMessage() {
    var input = document.getElementById("user_input").value.trim().toLowerCase();
    document.getElementById("user_input").value = "";
    updateChatbox("You: " + input);

    setTimeout(function() {
        let botResponse;

        if (state === "ASK_NAME") {
            leadName = input;
            botResponse = "Great! What's your email?";
            state = "ASK_EMAIL";
        } else if (state === "ASK_EMAIL") {
            leadEmail = input;
            botResponse = "Thanks! And what's the name of your company?";
            state = "ASK_COMPANY";
        } else if (state === "ASK_COMPANY") {
            leadCompany = input;
            botResponse = `Thanks, ${leadName}! How can I assist you further?`;
            state = "CHAT";
        } else {
            // General chat responses
            botResponse = getBotResponse(input);

            if (state === "CHAT" && leadName && leadEmail && leadCompany) {
                sendToSalesforce(leadName, leadEmail, leadCompany);
                leadName = "";
                leadEmail = "";
                leadCompany = "";
            }
        }

        updateChatbox("Bot: " + botResponse);
    }, 1000);
}

function getBotResponse(input) {
    // [Same as your existing function]
}

function sendToSalesforce(name, email, company) {
    console.log("Sending lead data to Salesforce:", name, email, company);
    const url = "https://rtslabs8-dev-ed.develop.my.salesforce.com/services/apexrest/LeadCreation/";
    const data = { LastName: name, Email: email, Company: company };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 6Cel800DHp000001tKCi888Hp0000005mCwGS5jOh3MGTnZJlWbBSMeYuiG6FDCPlDhG2Q0eQdAsZWziEfyMpnyhkVXR0Y1mSWTECpelZjk"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

// Conversation states
let state = "ASK_NAME";
let leadName = "";
let leadEmail = "";
let accessToken = "6Cel800DHp000001tKCi888Hp0000005mCwqdgYHQOk1fNEMcvnrjutjtgWtLyWKSIbP7mkYhB2EBEL1rYirWhBmV4egfR5sFEu7D4miDB6"

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
            leadName = input; // Capture the name
            botResponse = "Great! What's your email?";
            state = "ASK_EMAIL";
        } else if (state === "ASK_EMAIL") {
            leadEmail = input; // Capture the email
            botResponse = `Thanks, ${leadName}! How can I assist you further?`;
            state = "CHAT"; // Change state to general chat
        } else {
            // General chat responses
            botResponse = getBotResponse(input);

            // If lead information is captured, send it to Salesforce
            if (state === "CHAT" && leadName && leadEmail) {
                sendToSalesforce(leadName, leadEmail);
                leadName = ""; // Reset the lead information
                leadEmail = "";
            }
        }

        updateChatbox("Bot: " + botResponse);
    }, 1000);
}

function getBotResponse(input) {
    // Simple keyword-based responses
    const responses = {
        "hello": "Hello! What can I do for you today?",
        "help": "Sure, I can help. What do you need assistance with?",
        "services": "We offer a variety of services including X, Y, and Z. Which one interests you?",
        "pricing": "Our pricing depends on the service. Would you like specific details on any service?",
        "bye": "Goodbye! If you have more questions later, feel free to ask."
    };

    // Check for keywords in the user's input and return the corresponding response
    for (let key in responses) {
        if (input.includes(key)) {
            return responses[key];
        }
    }

    // Additional conversation logic
    if (input.includes("cost of")) {
        return "The cost varies depending on specific requirements. Could you please specify the service?";
    } else if (input.includes("thank you")) {
        return "You're welcome! Do you have any other questions?";
    }

    // Default response for unrecognized input
    return "I'm not sure how to respond to that. Could you give me more details or ask something else?";
}

function sendToSalesforce(name, email) {
    console.log("Sending lead data to Salesforce:", name, email);
    const url = "https://rtslabs8-dev-ed.develop.my.salesforce.com/services/apexrest/LeadCreation/";
    const data = { LastName: name, email: email };

    // Assuming you have handled authentication and have the access token
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

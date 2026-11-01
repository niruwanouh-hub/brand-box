const messagesEl = document.getElementById("assistantMessages");
const formEl = document.getElementById("assistantForm");
const inputEl = document.getElementById("assistantInput");
const statusEl = document.getElementById("assistantStatus");
const sendButton = document.getElementById("assistantSendButton");
const newChatButton = document.getElementById("newChatButton");
const conversation = [];
const MAX_HISTORY_MESSAGES = 12;
let waitingForReply = false;

function addMessage(role, text) {
    const container = document.createElement("div");
    container.className = `message ${role}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    container.appendChild(bubble);
    messagesEl.appendChild(container);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function resetConversation() {
    if (waitingForReply) return;
    conversation.length = 0;
    messagesEl.replaceChildren();
    addMessage("bot", "Hi! I can help with borrowing, returns, premium membership, account access, book recommendations, and general library questions.");
    statusEl.textContent = "";
    inputEl.focus();
}

async function askAssistant(message) {
    addMessage("user", message);
    inputEl.value = "";
    inputEl.disabled = true;
    sendButton.disabled = true;
    waitingForReply = true;
    statusEl.textContent = "The library assistant is thinking…";

    try {
        const history = conversation.slice(-MAX_HISTORY_MESSAGES);
        const response = await fetch("/api/assistant/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                history
            })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.reply) {
            throw new Error(result.error || "The AI assistant is currently unavailable.");
        }

        conversation.push(
            { role: "user", content: message },
            { role: "assistant", content: result.reply }
        );
        addMessage("bot", result.reply);
        statusEl.textContent = "";
    } catch (error) {
        statusEl.textContent = error instanceof Error
            ? error.message
            : "The AI assistant is unavailable right now. Please try again later.";
    } finally {
        waitingForReply = false;
        inputEl.disabled = false;
        sendButton.disabled = false;
        inputEl.focus();
    }
}

formEl.addEventListener("submit", event => {
    event.preventDefault();
    const message = inputEl.value.trim();
    if (!message || waitingForReply) return;
    askAssistant(message);
});

newChatButton.addEventListener("click", resetConversation);
resetConversation();

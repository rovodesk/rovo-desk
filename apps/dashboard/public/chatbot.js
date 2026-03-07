(() => {
	const API_URL = "https://api.yourdomain.com/api/chatroom/chat";

	const chatroomId = `room_${Math.random().toString(36).slice(2)}`;

	// Inject styles
	const style = document.createElement("style");
	style.innerHTML = `
    #my-chatbot-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: black;
      color: white;
      padding: 12px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 9999;
    }

    #my-chatbot-box {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 300px;
      height: 400px;
      background: white;
      border: 1px solid #ddd;
      display: none;
      flex-direction: column;
      z-index: 9999;
    }

    #my-chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }

    #my-chatbot-input {
      display: flex;
      border-top: 1px solid #ddd;
    }

    #my-chatbot-input input {
      flex: 1;
      border: none;
      padding: 8px;
    }

    #my-chatbot-input button {
      border: none;
      background: black;
      color: white;
      padding: 8px 12px;
    }
  `;
	document.head.appendChild(style);

	// Inject HTML
	const button = document.createElement("div");
	button.id = "my-chatbot-button";
	button.innerText = "💬";

	const box = document.createElement("div");
	box.id = "my-chatbot-box";
	box.innerHTML = `
    <div id="my-chatbot-messages"></div>
    <div id="my-chatbot-input">
      <input placeholder="Type a message..." />
      <button>Send</button>
    </div>
  `;

	document.body.appendChild(button);
	document.body.appendChild(box);

	button.onclick = () => {
		box.style.display = box.style.display === "flex" ? "none" : "flex";
	};

	const input = box.querySelector("input");
	const sendBtn = box.querySelector("button");
	const messages = box.querySelector("#my-chatbot-messages");

	function addMessage(text, sender) {
		const div = document.createElement("div");
		div.innerText = text;
		div.style.margin = "5px 0";
		div.style.textAlign = sender === "user" ? "right" : "left";
		messages.appendChild(div);
		messages.scrollTop = messages.scrollHeight;
	}

	async function sendMessage() {
		const message = input.value;
		if (!message) return;

		addMessage(message, "user");
		input.value = "";

		const res = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chatroomId,
				message,
			}),
		});

		const data = await res.json();
		addMessage(data.reply, "bot");
	}

	sendBtn.onclick = sendMessage;
})();

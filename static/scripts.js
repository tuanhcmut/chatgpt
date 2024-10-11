        const userInputEl = document.getElementById("user-input");
        const sendBtnEl = document.getElementById("send-btn");
        const chatBox = document.getElementById("chat-box");
        const scrollDownBtnEl = document.getElementById("scroll-down-btn");
        const settingsIcon = document.querySelector(".settings-icon");
        const serverModal = document.getElementById("server-modal");
        const serverUrlInput = document.getElementById("server-url");
        const saveServerUrlBtn = document.getElementById("save-server-url");

        // Get server URL from localStorage or use a default
        let serverUrl = localStorage.getItem("serverUrl") || window.location.href + "chat";
        serverUrlInput.value = serverUrl;
        settingsIcon.addEventListener("click", () => {
            serverModal.style.display = "flex";
        });

        saveServerUrlBtn.addEventListener("click", () => {
            serverUrl = serverUrlInput.value.trim();
            if (serverUrl) {
                localStorage.setItem("serverUrl", serverUrl);
                serverModal.style.display = "none";
            } else {
                alert("Please enter a valid URL.");
            }
        });

        sendBtnEl.addEventListener("click", sendMessage);

        async function sendMessage() {
            const message = userInputEl.value.trim();
            if (!message) return;

            addMessageToChat("user", message);
            userInputEl.value = "";
            disableInput();

            try {
                const response = await fetch(serverUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message })
                });
                const data = await response.json();
                addMessageToChat("bot", data.response);
            } catch (error) {
                alert("Error connecting to server.");
            } finally {
                enableInput();
            }
        }

        function addMessageToChat(sender, message) {
            const messageElement = document.createElement("div");
            messageElement.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");

            const copyBtn = document.createElement("i");
            copyBtn.classList.add("fas", "fa-copy", "copy-icon");
            copyBtn.onclick = () => copyMessage(message);

            messageElement.appendChild(copyBtn);

            const messageContent = document.createElement("div");
            messageContent.innerText = message;
            messageElement.appendChild(messageContent);

            chatBox.appendChild(messageElement);
            scrollToBottom();
        }

        function copyMessage(message) {
            navigator.clipboard.writeText(message);
        }

        function disableInput() {
            userInputEl.disabled = true;
            sendBtnEl.disabled = true;
        }

        function enableInput() {
            userInputEl.disabled = false;
            sendBtnEl.disabled = false;
            userInputEl.focus();
        }

        function scrollToBottom() {
            chatBox.scrollTop = chatBox.scrollHeight;
            scrollDownBtnEl.classList.remove("show");
        }

        chatBox.addEventListener("scroll", () => {
            const isAtBottom = chatBox.scrollHeight - chatBox.scrollTop === chatBox.clientHeight;
            scrollDownBtnEl.classList.toggle("show", !isAtBottom);
        });

        scrollDownBtnEl.addEventListener("click", scrollToBottom);

        // Listen for Enter key press to send message
        userInputEl.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });

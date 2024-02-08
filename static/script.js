// Function to type a sentence with a delay between each character
async function typeSentence(sentence, eleRef, speed = 5) {
    const letters = sentence.split("");
    for (let i = 0; i < letters.length; i++) {
        await waitForMs(speed);
        $(eleRef).append(letters[i]);
    }
}

// Function to delete a sentence with a delay between each character
async function deleteSentence(eleRef, speed = 5) {
    const sentence = $(eleRef).html();
    const letters = sentence.split("");
    while (letters.length > 0) {
        await waitForMs(speed);
        letters.pop();
        $(eleRef).html(letters.join(""));
    }
}

// Function to control the carousel animation
async function carousel(carouselList, eleRef) {
    for (let i = 0; i < carouselList.length; i++) {
        updateFontColor(eleRef, carouselList[i].color);
        await typeSentence(carouselList[i].text, eleRef);
        await waitForMs(1500);
        if (i !== carouselList.length - 1) {
            await deleteSentence(eleRef);
            await waitForMs(500);
        }
    }
}

// Function to update the font color of the element
function updateFontColor(eleRef, color) {
    $(eleRef).css('color', color);
}

// Function to wait for a specified time in milliseconds
function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to update the decision based on user selections
async function updateDecision(node) {
    const question = node.question;
    await deleteSentence("#feature-text"); // Delete previous question
    await typeSentence(question, "#feature-text"); // Type new question
}

async function startDecisionProcess(decisionTree, currentNodeKey = "root") {
    const currentNode = decisionTree[currentNodeKey];

    if (currentNode.hasOwnProperty('result')) {
        await updateDecision(currentNode);
        return currentNode['result'];
    }

    await updateDecision(currentNode);

    // Fade in the buttons after typing the question
    var buttonsElement = document.getElementById("buttons");
    buttonsElement.style.opacity = "1";

    const userSelection = await getUserSelection();

    // Fade out the buttons after user selection
    buttonsElement.style.opacity = "0";

    return startDecisionProcess(currentNode, userSelection); // Return the result of the recursive call
}

// Function to get user selection (returns "yes" or "no")
async function getUserSelection() {
    return new Promise(resolve => {
        document.getElementById("yes").addEventListener("click", function () {
            resolve("yes");
        });
        document.getElementById("no").addEventListener("click", function () {
            resolve("no");
        });
    });
}

function displayFirework() {
    // Create a video element for the background
    const video = document.createElement("video");
    video.src = "static/images/firework.mp4"; // Updated path to firework video
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // Mute the video to prevent audio playback
    video.style.position = "fixed";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    document.body.appendChild(video);

    const audio = document.createElement("audio");
    audio.src = "static/audio/chibichibichabachaba.mp3"; // Path to your audio file
    audio.loop = true; // Loop the audio playback
    audio.autoplay = true; // Autoplay the audio when the page loads
    audio.volume = 0.5; // Adjust the volume (0.0 to 1.0)

    document.body.appendChild(audio);

    const positions = [
        { src: "static/images/cat2.gif", left: "50%", top: "88%", transform: "translate(-50%, -50%) scale(0.5)" }, // Middle, smaller size
        { src: "static/images/cat1.gif", left: "1400.16px", top: "100.218px" }, // Top 393.218 left 711.16
        { src: "static/images/cat7.gif", left: "710.233px", top: "153.279px" }, // Left 710.233, top 153.279
        { src: "static/images/cat6.gif", left: "49.0009px", top: "272.764px" } // Left 47.0009, top 272.764
    ];

    // Add cat gifs to the page at specified positions
    positions.forEach(position => {
        const catGif = document.createElement("img");
        catGif.src = position.src;
        catGif.style.position = "absolute";
        catGif.style.left = position.left;
        catGif.style.top = position.top;
        if (position.transform) {
            catGif.style.transform = position.transform;
        }
        document.body.appendChild(catGif);
    });
}


document.addEventListener("DOMContentLoaded", function () {
    // Get the content element
    var contentElement = document.getElementById("content");

    // Listen for the end of the black-background animation
    document.getElementById("black-background").addEventListener("animationend", function () {
        // Add the fadeInContent class to start the content fade-in animation
        contentElement.classList.remove("hidden");
        contentElement.classList.add("fadeInContent");

        // Start the typing animation after the fadeInContent animation is completed
        contentElement.addEventListener("animationend", async function () {
            // Remove the event listener to prevent multiple calls
            contentElement.removeEventListener("animationend", arguments.callee);

            const carouselText = [
                { text: "Happy Early Valentines Day!", color: "#AF3E4D" },
                { text: "Although we're in different cities...", color: "#AF3E4D" },
                { text: "I still made this web to ask...", color: "#AF3E4D" },
            ];

            // Run the carousel animation
            await carousel(carouselText, "#feature-text");

            // Define the decision tree
            const decisionTree = {
                "root": {
                    "question": "Would you like to be my valentine this year?",
                    "yes": {
                        "question": "Are you really really sure?",
                        "yes": {
                            "question": "You know there's a 'no' option right?",
                            "yes": {
                                "question": "So, do you want to be my valentine this year?",
                                "yes": {
                                    "question": "YAY!",
                                    "result": "firework"
                                },
                                "no": {
                                    "question": "TOO LATE!",
                                    "result": "yoink"
                                }
                            },
                            "no": {
                                "question": "So, what now? Do you want to be my valentine this year?",
                                "yes": {
                                    "question": "YAY!",
                                    "result": "firework"
                                },
                                "no": {
                                    "question": "I'm sorry this option is not available.",
                                    "result": "button float"
                                }
                            }
                        },
                        "no": {
                            "question": "Hm, can you make up your mind now?",
                            "yes": {
                                "question": "Okay, so do you want to be my valentine this year?",
                                "yes": {
                                    "question": "YAY!",
                                    "result": "firework"
                                },
                                "no": {
                                    "question": "I'm sorry, it's too late to say no now.",
                                    "result": "button float"
                                }
                            },
                            "no": {
                                "question": "OK, I'll wait",
                                "result": "wait"
                            }
                        }
                    },
                    "no": {
                        "question": "You really want to hurt bebe?",
                        "yes": {
                            "question": "Oh no bebe is hurt now!!",
                            "result": "heal"
                        },
                        "no": {
                            "question": "So you want to be my valentine?",
                            "yes": {
                                "question": "YAY!",
                                "result": "firework"
                            },
                            "no": {
                                "question": "TOO LATE! You have to be my valentine now.",
                                "result": "yoink"
                            }
                        }
                    }
                }
            };

            const result = await startDecisionProcess(decisionTree);
            console.log(result)

            // Check the result and trigger actions accordingly
            if (result === "firework") {
                displayFirework()
            }
            else if (result === "button float") {

                // Ask the question again
                await waitForMs(800)
                await deleteSentence("#feature-text");
                await typeSentence("Last time, would you be my valentine?", "#feature-text");

                // Show the "Yes" and "No" buttons again
                const buttonsElement = document.getElementById("buttons");
                buttonsElement.style.opacity = "1";

                let detached = false;

                $('#no').on('mouseover', function () {
                    if (!detached) {
                        $(this).detach().appendTo('body'); // Move the button to the html element
                        detached = true;
                    }
                    $(this).css({
                        top: (Math.random() * 90) + '%',
                        left: (Math.random() * 90) + '%',
                        position: 'absolute',
                        zIndex: 9999, // Set a high z-index value
                        display: 'initial',
                        justifyContent: 'initial',
                        alignItems: 'initial',
                    });
                });

                // Wait for user selection
                const userSelection = await getUserSelection();
                console.log(userSelection)
                // Check user selection and continue the process accordingly
                if (userSelection === "yes") {

                    displayFirework()
                }
            }
            else if (result === "heal") {

            }

            else if (result === "wait") {

            }

            else if (result === "yoink") {

            }
        });
    });
});


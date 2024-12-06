document.getElementById("imageForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Select form elements
  const promptInput = document.getElementById("prompt");
  const prompt = promptInput.value.trim();
  const generateButton = document.getElementById("generateButton");
  const loadingMessage = document.getElementById("loading");
  const resultSection = document.getElementById("result");
  const generatedImage = document.getElementById("generatedImage");
  const downloadButton = document.getElementById("downloadButton");

  // Validate the input
  if (!prompt) {
    alert("Please enter a valid prompt.");
    return;
  }

  // Show loading and disable the button
  loadingMessage.style.display = "block";
  generateButton.disabled = true;

  try {
    // Send a POST request to the backend
    const response = await fetch("https://debobond-image-generatorai-1.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate the image. Please try again.");
    }

    const data = await response.json();
    const imageBase64 = data.image;

    // Display the generated image
    generatedImage.src = `data:image/png;base64,${imageBase64}`;
    resultSection.style.display = "block";

    // Set up the download button
    downloadButton.style.display = "inline-block";
    downloadButton.href = `data:image/png;base64,${imageBase64}`;
    downloadButton.download = "generated_image.png";
  } catch (error) {
    alert("An error occurred while generating the image: " + error.message);
  } finally {
    // Hide loading and re-enable the button
    loadingMessage.style.display = "none";
    generateButton.disabled = false;
  }
});

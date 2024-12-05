document.getElementById("imageForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const promptInput = document.getElementById("prompt");
    const prompt = promptInput.value;
    const generateButton = document.getElementById("generateButton");
    const loadingMessage = document.getElementById("loading");
    const resultSection = document.getElementById("result");
    const generatedImage = document.getElementById("generatedImage");
    const downloadButton = document.getElementById("downloadButton");
  
    // Show loading and disable the button
    loadingMessage.style.display = "block";
    generateButton.disabled = true;
  
    try {
      // Send a POST request to the backend
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }
  
      const data = await response.json();
      const imageBase64 = data.image;
  
      // Set the generated image
      generatedImage.src = `data:image/png;base64,${imageBase64}`;
      resultSection.style.display = "block";
  
      // Enable download button
      downloadButton.style.display = "inline-block";
      downloadButton.onclick = () => {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${imageBase64}`;
        link.download = "generated_image.png";
        link.click();
      };
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      // Hide loading and re-enable the button
      loadingMessage.style.display = "none";
      generateButton.disabled = false;
    }
  });
  
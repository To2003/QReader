document.getElementById('qr-input').addEventListener('change', function() {
    const fileInput = document.getElementById('qr-input');
    const resultDiv = document.getElementById('result');
    const resultText = document.querySelector('.qrResult');
    const imagePreview = document.getElementById('selected-image');
    const previewDiv = document.getElementById('image-preview');
  
    if (fileInput.files.length === 0) {
      alert('Please upload an image with a QR code.');
      return;
    }
  
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    // Mostrar la imagen seleccionada
    reader.onload = function (event) {
      imagePreview.src = event.target.result;
      imagePreview.classList.remove('hidden'); // Mostrar la imagen
      previewDiv.classList.remove('hidden'); // Mostrar el contenedor de la imagen
    };
  
    reader.readAsDataURL(file);
});
  
  document.getElementById('scan-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('qr-input');
    const resultDiv = document.getElementById('result');
    const resultText = document.querySelector('.qrResult');
    const imagePreview = document.getElementById('selected-image');
    
    if (fileInput.files.length === 0) {
      alert('Please upload an image with a QR code.');
      return;
    }
  
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    // Procesar la imagen para escanear el QR
    reader.onloadend = function () {
      const img = new Image();
      img.src = reader.result;
  
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
  
        // Usar la librería jsQR
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
  
        if (qrCode) {
          resultText.textContent = qrCode.data;
          resultDiv.classList.remove('hidden');
  
          // Abrir la URL en una nueva pestaña si es válida
          if (qrCode.data.startsWith('http://') || qrCode.data.startsWith('https://')) {
            if (confirm('QR code detected. Do you want to open the link in a new tab?')) {
              window.open(qrCode.data, '_blank');
            }
          } else {
            alert('The QR code does not contain a valid URL.');
          }
        } else {
          resultText.textContent = 'No QR code found in the image.';
          resultDiv.classList.remove('hidden');
        }
      };
    };
    
    reader.readAsDataURL(file);
  });
  
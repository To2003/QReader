// Referencias a los elementos
const fileInput = document.getElementById('qr-input');
const imagePreview = document.getElementById('image-preview');
const selectedImage = document.getElementById('selected-image');
const scanButton = document.getElementById('scan-btn');

// Mostrar la imagen seleccionada en la vista previa
fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (event) {
      selectedImage.src = event.target.result; // Asignar la imagen al elemento img
      imagePreview.style.display = 'block'; // Mostrar el contenedor de la imagen
    };

    reader.readAsDataURL(fileInput.files[0]);
  } else {
    imagePreview.style.display = 'none'; // Ocultar si no hay imagen seleccionada
  }
});

// Escanear el QR al hacer clic en el botón
scanButton.addEventListener('click', () => {
  const resultDiv = document.getElementById('result');
  const resultText = document.querySelector('.qrResult');

  if (fileInput.files.length === 0) {
    alert('Please upload an image with a QR code.');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        resultText.textContent = qrCode.data;
        resultDiv.classList.remove('hidden');

        // Si el QR contiene una URL válida, abrir en una nueva pestaña
        if (qrCode.data.startsWith('http://') || qrCode.data.startsWith('https://')) {
          if (confirm('QR code detected. Do you want to navigate to the link?')) {
            window.open(qrCode.data, '_blank'); // Abre en una nueva pestaña
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

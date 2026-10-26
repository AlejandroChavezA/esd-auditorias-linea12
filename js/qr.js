const QR = (() => {
  let stream = null;
  let rafId = 0;
  let scanning = false;
  let lastCode = '';
  let lastAt = 0;

  const payloadFor = (machineId) => {
    const url = new URL(location.pathname, location.origin);
    url.searchParams.set('id', String(machineId).trim());
    return url.toString();
  };

  const parsePayload = (raw = '') => {
    const text = String(raw).trim();
    if (!text) return null;
    try {
      const id = new URL(text).searchParams.get('id');
      if (id) return decodeURIComponent(id).trim();
    } catch {}
    return text;
  };

  const ensureLib = () => {
    if (typeof QRious === 'undefined') {
      throw new Error('La librería de QR no está disponible.');
    }
  };

  const make = (machineId, size = 180, canvas) => {
    ensureLib();
    return new QRious({
      element: canvas,
      value: payloadFor(machineId),
      size: Math.max(80, Number(size) || 180),
      level: 'M',
      background: '#ffffff',
      foreground: '#16283a'
    });
  };

  const draw = async (canvas, machineId, size = 180) => {
    make(machineId, size, canvas);
  };

  const paintAll = async (root = document) => {
    const canvases = [...root.querySelectorAll('canvas[data-qr]')];
    canvases.forEach((canvas) => {
      const id = canvas.dataset.qr;
      if (!id) return;
      try {
        make(id, Number(canvas.dataset.size || 180), canvas);
      } catch (err) {
        console.error('No se pudo dibujar el QR', id, err);
      }
    });
  };

  const toDataURL = async (machineId, size = 360) => make(machineId, size).toDataURL('image/png');

  const download = async (machineId, name = '') => {
    const url = await toDataURL(machineId, 512);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${machineId}${name ? '-' + name.replace(/\s+/g, '-').toLowerCase() : ''}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const stopCamera = () => {
    scanning = false;
    cancelAnimationFrame(rafId);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    const video = document.getElementById('scanVideo');
    if (video) video.srcObject = null;
  };

  const decodeImageData = (imageData) => {
    if (typeof jsQR !== 'function') return null;
    const result = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
    return result?.data || null;
  };

  const scanLoop = (video, canvas, onResult) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const tick = () => {
      if (!scanning) return;
      if (video.readyState >= 2) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const code = decodeImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (code) {
          const now = Date.now();
          if (code !== lastCode || now - lastAt > 1800) {
            lastCode = code;
            lastAt = now;
            const id = parsePayload(code);
            if (id) onResult(id, code);
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    tick();
  };

  const startCamera = async (onResult) => {
    const video = document.getElementById('scanVideo');
    const canvas = document.getElementById('scanCanvas');
    const status = document.getElementById('scanStatus');
    if (!video || !canvas) return;
    stopCamera();
    if (!navigator.mediaDevices?.getUserMedia) {
      if (status) status.textContent = 'Este navegador no permite usar la cámara.';
      throw new Error('Cámara no disponible');
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
    } catch {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    video.srcObject = stream;
    await video.play();
    scanning = true;
    if (status) status.textContent = 'Apunta al QR de la etiqueta…';
    scanLoop(video, canvas, onResult);
  };

  const fromFile = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const code = decodeImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      URL.revokeObjectURL(img.src);
      const id = parsePayload(code || '');
      if (id) resolve(id);
      else reject(new Error('No se encontró un QR válido en la imagen.'));
    };
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    img.src = URL.createObjectURL(file);
  });

  return { payloadFor, parsePayload, draw, paintAll, toDataURL, download, startCamera, stopCamera, fromFile };
})();

function drawBrick(canvas, x, y, width, height, border, color) {
  canvas.beginPath();
  canvas.fillStyle = `${color.left}`;
  canvas.moveTo(x, y + height);
  canvas.lineTo(x, y);
  canvas.lineTo(x + border, y + border);
  canvas.lineTo(x + border, y + height - border);
  canvas.closePath();
  canvas.fill();

  canvas.beginPath();
  canvas.fillStyle = `${color.top}`;
  canvas.moveTo(x, y);
  canvas.lineTo(x + width, y);
  canvas.lineTo(x + width - border, y + border);
  canvas.lineTo(x + border, y + border);
  canvas.closePath();
  canvas.fill();

  canvas.beginPath();
  canvas.fillStyle = `${color.right}`;
  canvas.moveTo(x + width, y);
  canvas.lineTo(x + width, y + height);
  canvas.lineTo(x + width - border, y + height - border);
  canvas.lineTo(x + width - border, y + border);
  canvas.closePath();
  canvas.fill();

  canvas.beginPath();
  canvas.fillStyle = `${color.bottom}`;
  canvas.moveTo(x + width, y + height);
  canvas.lineTo(x, y + height);
  canvas.lineTo(x + border, y + height - border);
  canvas.lineTo(x + width - border, y + height - border);
  canvas.closePath();
  canvas.fill();

  canvas.beginPath();
  canvas.fillStyle = `${color.main}`;
  canvas.moveTo(x + border, y + border);
  canvas.lineTo(x + width - border, y + border);
  canvas.lineTo(x + width - border, y + height - border);
  canvas.lineTo(x + border, y + height - border);
  canvas.closePath();
  canvas.fill();
}

export { drawBrick };

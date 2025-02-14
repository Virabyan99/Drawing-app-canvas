const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 60;
canvas.height = 400;

let context = canvas.getContext('2d');
let start_background_color = 'white';
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = 'black';
let draw_width = '2';
let is_drawing = false;

let restore_array = [];
let index = -1;

function change_color(element) {
  draw_color = element.style.background;
}

canvas.addEventListener('touchstart', start, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', draw, false);

canvas.addEventListener('touchend', stop, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);

function getEventPosition(event) {
  if (event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX - canvas.offsetLeft,
      y: event.touches[0].clientY - canvas.offsetTop
    };
  } else {
    return {
      x: event.clientX - canvas.offsetLeft,
      y: event.clientY - canvas.offsetTop
    };
  }
}

function start(event) {
  is_drawing = true;
  context.beginPath();
  let pos = getEventPosition(event);
  context.moveTo(pos.x, pos.y);
  event.preventDefault(); // Prevent default only when drawing starts
}

function draw(event) {
  if (is_drawing) {
    let pos = getEventPosition(event);
    context.lineTo(pos.x, pos.y);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
    event.preventDefault(); // Prevent default during drawing to avoid scrolling
  }
}

function stop(event) {
  if (is_drawing) {
    context.stroke();
    context.closePath();
    is_drawing = false;
  }
  if (event.type !== 'mouseout') {
    restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
  }
}

function clear_canvas() {
  context.fillStyle = start_background_color;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);

  restore_array = [];
  index = -1;
}

function undo_last() {
  if (index <= 0) {
    clear_canvas();
  } else {
    index -= 1;
    restore_array.pop();
    context.putImageData(restore_array[index], 0, 0);
  }
}

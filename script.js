const mqttClient = mqtt.connect('wss://test.mosquitto.org:8081/mqtt');
let motorLigado = false;
let startTime = null;
const MAX_DATA_POINTS = 300;

const ctx = document.getElementById('rpmChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Velocidade (RPM)',
      borderColor: 'blue',
      data: [],
      fill: false,
    }]
  },
  options: {
    animation: false,
    scales: {
      x: { title: { display: true, text: 'Tempo (s)' } },
      y: { title: { display: true, text: 'RPM' }, min: 0, max: 150 }
    }
  }
});

mqttClient.on('connect', () => {
  mqttClient.subscribe('IFPBCajazeiras/usuario01/data');
  mqttClient.subscribe('IFPBCajazeiras/usuario01/Time');
});

mqttClient.on('message', (topic, message) => {
  const value = parseFloat(message.toString());
  if (topic.endsWith('data') && motorLigado) {
    const time = (Date.now() - startTime) / 1000;
    if (chart.data.labels.length >= MAX_DATA_POINTS) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
    chart.data.labels.push(time.toFixed(1));
    chart.data.datasets[0].data.push(value);
    chart.update();
  }
});

function toggleMotor() {
  motorLigado = !motorLigado;
  document.getElementById('led-indicator').className = motorLigado ? 'led on' : 'led off';
  document.getElementById('motor-shaft').style.display = motorLigado ? 'block' : 'none';
  if (motorLigado) {
    startTime = Date.now();
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
  }
  mqttClient.publish('IFPBCajazeiras/usuario01/Acionamento', motorLigado ? '1' : '0');
}

function sendSetpoint() {
  const value = document.getElementById('setpoint').value;
  mqttClient.publish('IFPBCajazeiras/usuario01/setpoint', value);
}

function login() {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if (u === 'TCC_CJ' && p === 'CJ_IFPB') {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
  } else {
    alert('Login inválido.');
  }
}
